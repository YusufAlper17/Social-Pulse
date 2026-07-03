from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import html
import mysql.connector
from mysql.connector import Error
import time
from functools import lru_cache
import json
from textblob import TextBlob
import re
import os
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://frontend-iota-gold-57.vercel.app",
    r"https://.*\.vercel\.app",
]
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", ",".join(DEFAULT_CORS_ORIGINS)).split(",")
    if origin.strip()
]
CORS(app, resources={
    r"/*": {
        "origins": CORS_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'social_listening')
}

# Önbellek için global değişkenler
news_cache = {}
CACHE_DURATION = 900  # 15 dakika
last_api_call = 0
api_call_interval = 2  # saniye

def get_cache_key(keyword, domains_str=None):
    """Önbellek için benzersiz anahtar oluştur"""
    return f"{keyword}:{domains_str if domains_str else 'all'}"

def get_from_cache(cache_key):
    """Önbellekten veri al"""
    if cache_key in news_cache:
        cache_data = news_cache[cache_key]
        if datetime.now() < cache_data['expires']:
            print(f"[cache] Önbellekten veri alındı: {cache_key}")
            return cache_data['data']
    return None

def save_to_cache(cache_key, data):
    """Veriyi önbelleğe kaydet"""
    news_cache[cache_key] = {
        'data': data,
        'expires': datetime.now() + timedelta(seconds=CACHE_DURATION)
    }
    print(f"[cache] Veri önbelleğe kaydedildi: {cache_key}")

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return None

# Anahtar kelimeleri veritabanından çek fonksiyonunu kaldır
def get_keywords_from_db():
    return []

# Varsayılan anahtar kelimeleri kaldır
ACCOUNT_KEYWORDS = []

# API Anahtarı ve URL
NEWS_API_KEY = os.getenv('NEWS_API_KEY', '')
NEWS_API_URL = "https://newsapi.org/v2/everything"

# Kaynak ID'lerini domain'lerle eşleştirme
SOURCE_DOMAINS = {
    'hurriyet': 'hurriyet.com.tr',
    'sabah': 'sabah.com.tr',
    'milliyet': 'milliyet.com.tr',
    'cnnturk': 'cnnturk.com',
    'ntv': 'ntv.com.tr',
    'trthaber': 'trthaber.com.tr',
    'sozcu': 'sozcu.com.tr',
    't24': 't24.com.tr',
    'birgun': 'birgun.net',
    'gazeteduvar': 'gazeteduvar.com',
    'evrensel': 'evrensel.net',
    'odatv': 'odatv4.com',
    'bloomberght': 'bloomberght.com',
    'dunya': 'dunya.com',
    'mynet': 'mynet.com'
}

def analyze_sentiment(text):
    """
    Metni analiz ederek duygu durumunu belirler.
    Pozitif, negatif ve nötr kelimelerin varlığına göre sentiment değeri döndürür.
    """
    # Metin temizleme
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    
    # Türkçe pozitif ve negatif kelime listeleri
    positive_words = {
        'başarılı', 'iyi', 'güzel', 'harika', 'mükemmel', 'muhteşem', 'pozitif',
        'artış', 'yükseliş', 'kazanç', 'büyüme', 'gelişme', 'iyileşme', 'olumlu',
        'başarı', 'kazanım', 'mutlu', 'sevindirici', 'destekleyici', 'avantaj',
        'fırsat', 'yenilik', 'ilerleme', 'güçlü', 'istikrarlı', 'güven'
    }
    
    negative_words = {
        'kötü', 'başarısız', 'olumsuz', 'zayıf', 'düşüş', 'kayıp', 'zarar',
        'kriz', 'problem', 'sorun', 'risk', 'tehlike', 'endişe', 'korku',
        'belirsizlik', 'gerileme', 'azalma', 'düşme', 'çöküş', 'iflas',
        'kaygı', 'şikayet', 'eleştiri', 'yetersiz', 'başarısızlık', 'hata'
    }
    
    words = text.split()
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)
    
    # Sentiment skorunu hesapla
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'

def cached_news_api_ara(keyword, domains_str=None):
    """News API çağrılarını önbellekleyen fonksiyon"""
    global last_api_call
    
    # Önbellek anahtarını oluştur
    cache_key = get_cache_key(keyword, domains_str)
    
    # Önbellekten kontrol et
    cached_data = get_from_cache(cache_key)
    if cached_data is not None:
        return cached_data
    
    # API çağrıları arasında minimum süre kontrolü
    current_time = time.time()
    if current_time - last_api_call < api_call_interval:
        time.sleep(api_call_interval - (current_time - last_api_call))
    last_api_call = time.time()
    
    try:
        params = {
            'q': keyword,
            'language': 'tr',
            'sortBy': 'publishedAt',
            'apiKey': NEWS_API_KEY,
            'pageSize': 100,
            'searchIn': 'title,description,content'
        }
        
        if domains_str:
            params['domains'] = domains_str
        
        print(f"[cached_news_api_ara] News API'ye istek gönderiliyor: {keyword}, Parametreler: {params}")
        response = requests.get(NEWS_API_URL, params=params)
        
        if response.status_code != 200:
            print(f"[cached_news_api_ara] API Hata - Status Code: {response.status_code}")
            print(f"[cached_news_api_ara] API Yanıt: {response.text}")
            return []
            
        data = response.json()
        
        if data.get('status') != 'ok':
            print("[cached_news_api_ara] API Hata:", data.get('message', 'Bilinmeyen hata'))
            return []
            
        articles = data.get('articles', [])
        print(f"[cached_news_api_ara] API'den {len(articles)} haber alındı")
        
        # Sonuçları önbelleğe kaydet
        save_to_cache(cache_key, articles)
        
        return articles
        
    except Exception as e:
        print(f"[cached_news_api_ara] News API'de hata: {str(e)}")
        import traceback
        print("[cached_news_api_ara] Hata detayı:", traceback.format_exc())
        return []

def keyword_match_score(text, keywords):
    """
    Gelişmiş anahtar kelime eşleşme puanı hesaplama.
    Büyük/küçük harf duyarsız, kısmi eşleşme, Türkçe karakterlere duyarlı.
    """
    try:
        # Türkçe karakterleri normalize et
        def normalize_text(s):
            return s.lower().replace('ı', 'i').replace('İ', 'i')
        
        # Metni ve anahtar kelimeleri normalize et
        text = normalize_text(text)
        keywords = [normalize_text(k) for k in keywords]
        
        # Tüm keywordler için toplam puan hesapla
        total_match_score = 0
        for keyword in keywords:
            # Tam kelime eşleşmesi
            exact_matches = len([w for w in text.split() if w == keyword]) * 5
            
            # Kısmi eşleşme (kelime parçaları)
            partial_matches = len([w for w in text.split() if keyword in w]) * 3
            
            # Kelime başı ve sonu eşleşmesi
            word_start_matches = len([w for w in text.split() if w.startswith(keyword)]) * 2
            
            # Benzer kelime eşleşmesi (Levenshtein benzeri)
            from difflib import SequenceMatcher
            fuzzy_matches = sum(1 for w in text.split() 
                                if SequenceMatcher(None, w, keyword).ratio() >= 0.6) * 1
            
            # Her keyword için puan hesapla ve toplama
            keyword_score = exact_matches + partial_matches + word_start_matches + fuzzy_matches
            total_match_score += keyword_score
            
            # Detaylı log ekle
            print(f"[Keyword Debug] Keyword: {keyword}")
            print(f"[Keyword Debug] Exact Matches: {exact_matches}")
            print(f"[Keyword Debug] Partial Matches: {partial_matches}")
            print(f"[Keyword Debug] Word Start Matches: {word_start_matches}")
            print(f"[Keyword Debug] Fuzzy Matches: {fuzzy_matches}")
            print(f"[Keyword Debug] Keyword Score: {keyword_score}")
        
        print(f"[Keyword Debug] Total Match Score: {total_match_score}")
        return total_match_score
    except Exception as e:
        print(f"Keyword match score hesaplanırken hata: {str(e)}")
        return 0

def news_api_ara(keyword, sources=None):
    try:
        # Domainleri hazırla
        domains_str = None
        if sources:
            # source ID'lerini domain'lere çevir
            domains = [SOURCE_DOMAINS.get(source, source) for source in sources]
            # Boş veya None değerleri filtrele
            domains = [d for d in domains if d]
            if domains:
                domains_str = ','.join(domains)
                print(f"[news_api_ara] Filtrelenen domainler: {domains_str}")
            else:
                print("[news_api_ara] Geçerli domain bulunamadı")
        
        # Önbellekten veya API'den haberleri al
        articles = cached_news_api_ara(keyword, domains_str)
        
        # Anahtar kelime eşleşmesine göre filtreleme ve sıralama
        filtered_articles = []
        for article in articles:
            try:
                baslik = article.get('title', '')
                content = article.get('description', '')
                full_text = f"{baslik} {content}"
                
                # Anahtar kelime eşleşme puanını hesapla
                match_score = keyword_match_score(full_text, [keyword])
                
                print(f"[Keyword Debug] Full Text: {full_text}")
                print(f"[Keyword Debug] Match Score: {match_score}")
                
                # Eşleşme puanı kontrolünü daha esnek yap
                if match_score > -1:  # Neredeyse her haberi dahil et
                    # Kaynak domain'inden ID'yi bul
                    source_domain = article.get('source', {}).get('name', '').lower()
                    source_id = next(
                        (k for k, v in SOURCE_DOMAINS.items() if v in source_domain),
                        source_domain.replace('.', '').replace('com', '').replace('tr', '')
                    )
                    
                    sentiment = analyze_sentiment(full_text)
                    
                    # Tarih bilgisini düzelt
                    published_at = article.get('publishedAt', datetime.now().isoformat())
                    
                    haber = {
                        'id': str(hash(article.get('url', ''))),
                        'title': baslik,
                        'sourceId': source_id,
                        'content': content,
                        'author': {
                            'name': article.get('author', 'Anonim'),
                            'avatar': '/avatars/default.png',
                            'followers': random.randint(100, 10000),  # Rastgele takipçi sayısı
                            'posts': random.randint(10, 1000)  # Rastgele gönderi sayısı
                        },
                        '_match_score': match_score,  # Geçici eşleşme puanı
                        'sentiment': sentiment,
                        'date': published_at,
                        'sourceUrl': article.get('url', '')
                    }
                    
                    filtered_articles.append(haber)
                    
                    print(f"[Keyword Debug] Article Added: {baslik}")
                else:
                    print(f"[Keyword Debug] Article Skipped: {baslik}")
                
            except Exception as e:
                print(f"[Keyword Debug] Error processing article: {str(e)}")
        
        # Eşleşme puanına göre sırala (en yüksek puan önce)
        filtered_articles.sort(key=lambda x: x['_match_score'], reverse=True)
        
        # Sıralama puanını kaldır
        for article in filtered_articles:
            del article['_match_score']
        
        print(f"[news_api_ara] Toplam {len(filtered_articles)} haber bulundu")
        return filtered_articles
        
    except Exception as e:
        print(f"[news_api_ara] Hata: {str(e)}")
        import traceback
        print("[news_api_ara] Hata detayı:", traceback.format_exc())
        return []

@app.route('/api/posts', methods=['GET'])
def get_posts():
    try:
        sources = request.args.getlist('sources[]')
        keywords = request.args.getlist('keywords[]')
        search_query = request.args.get('search')
        
        print(f"[GET /api/posts] Gelen istek - Kaynaklar: {sources}, Anahtar Kelimeler: {keywords}, Arama: {search_query}")
        
        # Eğer hiçbir kaynak seçilmemişse, tüm kaynakları kullan
        if not sources:
            sources = list(SOURCE_DOMAINS.keys())
            print(f"[GET /api/posts] Hiçbir kaynak seçilmedi, tüm kaynaklar kullanılacak: {sources}")
        
        # Anahtar kelimeler için esnek yaklaşım
        if not keywords and not search_query:
            keywords = ['gündem', 'haber', 'son dakika', 'Türkiye']
            print(f"[GET /api/posts] Varsayılan anahtar kelimeler kullanılıyor: {keywords}")
        
        # Arama sorgusu varsa onu kullan
        if search_query:
            keywords = [search_query]
        
        # Tüm keywordler için tek seferde istek at
        all_keywords = ' OR '.join(keywords)
        print(f"[GET /api/posts] Birleştirilmiş arama sorgusu: {all_keywords}")
        
        # Haberleri al
        news = []
        for keyword in keywords:
            keyword_news = news_api_ara(keyword, sources)
            news.extend(keyword_news)
        
        # Tekrar eden haberleri kaldır
        unique_news = {article['id']: article for article in news}.values()
        
        # Tarihe göre sırala
        sorted_news = sorted(unique_news, key=lambda x: x['date'], reverse=True)
        
        print(f"[GET /api/posts] Toplam {len(sorted_news)} benzersiz haber bulundu")
            
        return jsonify(sorted_news)
        
    except Exception as e:
        error_msg = f"Haber getirme sırasında hata: {str(e)}"
        print(f"[GET /api/posts] ERROR: {error_msg}")
        import traceback
        print("[GET /api/posts] Hata detayı:", traceback.format_exc())
        return jsonify({'error': error_msg}), 500

@app.route('/api/sources')
def get_sources():
    return jsonify({
        'sources': [
            {'id': 'hurriyet', 'name': 'Hürriyet', 'logo': '/logos/hurriyet.png'},
            {'id': 'sozcu', 'name': 'Sözcü', 'logo': '/logos/sozcu.png'},
            {'id': 'sabah', 'name': 'Sabah', 'logo': '/logos/sabah.png'},
            {'id': 'milliyet', 'name': 'Milliyet', 'logo': '/logos/milliyet.png'},
            {'id': 'cnnturk', 'name': 'CNN Türk', 'logo': '/logos/cnnturk.png'},
            {'id': 'ntv', 'name': 'NTV', 'logo': '/logos/ntv.png'},
            {'id': 'trthaber', 'name': 'TRT Haber', 'logo': '/logos/trt.png'},
            {'id': 't24', 'name': 'T24', 'logo': '/logos/t24.png'},
            {'id': 'birgun', 'name': 'BirGün', 'logo': '/logos/birgun.png'},
            {'id': 'evrensel', 'name': 'Evrensel', 'logo': '/logos/evrensel.png'},
            {'id': 'odatv', 'name': 'OdaTV', 'logo': '/logos/odatv.png'},
            {'id': 'bloomberght', 'name': 'Bloomberg HT', 'logo': '/logos/bloomberght.png'},
            {'id': 'dunya', 'name': 'Dünya Gazetesi', 'logo': '/logos/dunya.png'},
            {'id': 'mynet', 'name': 'Mynet Finans', 'logo': '/logos/mynet.png'}
        ]
    })

@app.route('/api/trends', methods=['GET'])
def get_trends():
    return jsonify({
        'keywords': [
            {'name': 'gündem', 'count': 128},
            {'name': 'haber', 'count': 96},
            {'name': 'teknoloji', 'count': 74},
            {'name': 'ekonomi', 'count': 63},
            {'name': 'sosyal medya', 'count': 51}
        ]
    })

@app.route('/api/search', methods=['GET'])
def search():
    """
    Arama endpoint'i
    Query parametreleri:
    - search: Arama sorgusu (zorunlu)
    - sources[]: Kaynak ID'leri (isteğe bağlı)
    """
    try:
        search_query = request.args.get('search')
        if not search_query:
            return jsonify({'error': 'Arama sorgusu gerekli'}), 400

        sources = request.args.getlist('sources[]')
        print(f"[search] Arama sorgusu: {search_query}, Kaynaklar: {sources}")

        # News API'den haberleri al
        articles = news_api_ara(search_query, sources)
        
        if not articles:
            print("[search] Haber bulunamadı")
            return jsonify([])

        print(f"[search] {len(articles)} haber bulundu")
        return jsonify(articles)

    except Exception as e:
        print(f"[search] Hata: {str(e)}")
        import traceback
        print("[search] Hata detayı:", traceback.format_exc())
        return jsonify({'error': 'Arama sırasında bir hata oluştu'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5004, host='localhost') 