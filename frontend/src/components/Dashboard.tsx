import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import {
  buildApiHeaders,
  hasNewsApiKey,
  NEWS_API_KEY_UPDATED_EVENT,
} from '../utils/newsApiKey';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  useTheme,
  List,
  Collapse,
  Menu,
  MenuItem,
  Checkbox,
  CircularProgress,
  Alert,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import ReportIcon from '@mui/icons-material/Report';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { alpha } from '@mui/material/styles';
import { AppContext } from '../App';

interface MediaSource {
  id: string;
  name: string;
  logo: string;
  category: string;
}

interface Post {
  id: string;
  sourceId: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    followers?: number;
    posts?: number;
  };
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sourceUrl?: string;
}

// Her medya kaynağı için minimal, profesyonel tek renk
const getSourceColor = (sourceId: string): string => {
  const colors: { [key: string]: string } = {
    // Haber Siteleri - Pastel ve muted tonlar
    'hurriyet': '#6366f1',      // Indigo
    'sabah': '#ec4899',         // Pink
    'milliyet': '#3b82f6',      // Blue
    'cnnturk': '#10b981',       // Emerald
    'ntv': '#f59e0b',           // Amber
    'trthaber': '#06b6d4',      // Cyan
    'sozcu': '#8b5cf6',         // Violet
    't24': '#ef4444',           // Red
    'birgun': '#f97316',        // Orange
    'gazeteduvar': '#14b8a6',   // Teal
    'evrensel': '#6366f1',      // Indigo
    'odatv': '#ec4899',         // Pink
    'bloomberght': '#3b82f6',   // Blue
    'dunya': '#10b981',         // Emerald
    'mynet': '#f59e0b',         // Amber
    // Sosyal Medya - Platform renklerine yakın ama muted
    'twitter': '#1d9bf0',       // Twitter blue (muted)
    'instagram': '#e4405f',      // Instagram pink (muted)
    'facebook': '#1877f2',      // Facebook blue
    'tiktok': '#000000',        // Black
    'youtube': '#ff0000',        // YouTube red
    'linkedin': '#0a66c2',      // LinkedIn blue
    'snapchat': '#fffc00',      // Yellow
    'pinterest': '#bd081c',     // Pinterest red
    // Forum & Sözlük
    'eksisozluk': '#ef4444',    // Red
    'uludagsozluk': '#14b8a6',  // Teal
    'incisozluk': '#fbbf24',    // Yellow
    'kizlarsoruyor': '#ec4899', // Pink
    'donanimhaber': '#3b82f6',  // Blue
    'forumtr': '#8b5cf6',       // Violet
    'technopat': '#10b981',     // Emerald
    'r10': '#f97316',           // Orange
    'shiftdelete': '#64748b',   // Slate
    // Video & Yayın
    'youtube_live': '#ff0000',   // Red
    'twitch': '#9146ff',        // Purple
    'dailymotion': '#00aaff',   // Blue
    'vimeo': '#1ab7ea',         // Cyan
    'periscope': '#40a3f5',     // Light blue
    // Blog & İçerik
    'medium': '#000000',        // Black
    'blogger': '#ff5722',       // Deep orange
    'wordpress': '#21759b',     // Blue
    'onedio': '#ef4444',        // Red
    'webtekno': '#14b8a6',      // Teal
    'tumblr': '#36465d',        // Dark blue-gray
    'squarespace': '#000000',    // Black
    // Anlık Haber
    'telegram': '#0088cc',      // Telegram blue
    'whatsapp': '#25d366',      // WhatsApp green
    'discord': '#5865f2',       // Discord blurple
    'signal': '#3a76f0',        // Signal blue
    'reddit': '#ff4500',        // Reddit orange
    // Eğlence & Magazin
    'onedio_magazin': '#ef4444', // Red
    'acunn': '#fbbf24',         // Yellow
    'medyatava': '#ec4899',     // Pink
    'raninitv': '#10b981',      // Emerald
    'magazinnot': '#f97316',    // Orange
  };
  
  return colors[sourceId] || '#6366f1'; // Default indigo
};

// İlk harfi al
const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const mediaSources: { [key: string]: MediaSource[] } = {
  'Haber Siteleri': [
    { id: 'hurriyet', name: 'Hürriyet', logo: '/logos/hurriyet.png', category: 'Haber Siteleri' },
    { id: 'sabah', name: 'Sabah', logo: '/logos/sabah.png', category: 'Haber Siteleri' },
    { id: 'milliyet', name: 'Milliyet', logo: '/logos/milliyet.png', category: 'Haber Siteleri' },
    { id: 'cnnturk', name: 'CNN Türk', logo: '/logos/cnnturk.png', category: 'Haber Siteleri' },
    { id: 'ntv', name: 'NTV', logo: '/logos/ntv.png', category: 'Haber Siteleri' },
    { id: 'trthaber', name: 'TRT Haber', logo: '/logos/trthaber.png', category: 'Haber Siteleri' },
    { id: 'sozcu', name: 'Sözcü', logo: '/logos/sozcu.png', category: 'Haber Siteleri' },
    { id: 't24', name: 'T24', logo: '/logos/t24.png', category: 'Haber Siteleri' },
    { id: 'birgun', name: 'BirGün', logo: '/logos/birgun.png', category: 'Haber Siteleri' },
    { id: 'gazeteduvar', name: 'Gazete Duvar', logo: '/logos/gazeteduvar.png', category: 'Haber Siteleri' },
    { id: 'evrensel', name: 'Evrensel', logo: '/logos/evrensel.png', category: 'Haber Siteleri' },
    { id: 'odatv', name: 'OdaTV', logo: '/logos/odatv.png', category: 'Haber Siteleri' },
    { id: 'bloomberght', name: 'Bloomberg HT', logo: '/logos/bloomberght.png', category: 'Haber Siteleri' },
    { id: 'dunya', name: 'Dünya Gazetesi', logo: '/logos/dunya.png', category: 'Haber Siteleri' },
    { id: 'mynet', name: 'Mynet Finans', logo: '/logos/mynet.png', category: 'Haber Siteleri' }
  ],
  'Sosyal Medya Platformları': [
    { id: 'twitter', name: 'Twitter / X', logo: '/logos/twitter.png', category: 'Sosyal Medya Platformları' },
    { id: 'instagram', name: 'Instagram', logo: '/logos/instagram.png', category: 'Sosyal Medya Platformları' },
    { id: 'facebook', name: 'Facebook', logo: '/logos/facebook.png', category: 'Sosyal Medya Platformları' },
    { id: 'tiktok', name: 'TikTok', logo: '/logos/tiktok.png', category: 'Sosyal Medya Platformları' },
    { id: 'youtube', name: 'YouTube', logo: '/logos/youtube.png', category: 'Sosyal Medya Platformları' },
    { id: 'linkedin', name: 'LinkedIn', logo: '/logos/linkedin.png', category: 'Sosyal Medya Platformları' },
    { id: 'snapchat', name: 'Snapchat', logo: '/logos/snapchat.png', category: 'Sosyal Medya Platformları' },
    { id: 'pinterest', name: 'Pinterest', logo: '/logos/pinterest.png', category: 'Sosyal Medya Platformları' }
  ],
  'Forum & Sözlük Siteleri': [
    { id: 'eksisozluk', name: 'Ekşi Sözlük', logo: '/logos/eksisozluk.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'uludagsozluk', name: 'Uludağ Sözlük', logo: '/logos/uludag.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'incisozluk', name: 'İnci Sözlük', logo: '/logos/inci.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'kizlarsoruyor', name: 'Kızlar Soruyor', logo: '/logos/kizlarsoruyor.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'donanimhaber', name: 'DonanımHaber Forum', logo: '/logos/donanimhaber.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'forumtr', name: 'ForumTR', logo: '/logos/forumtr.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'technopat', name: 'Technopat Sosyal', logo: '/logos/technopat.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'r10', name: 'R10 Forum', logo: '/logos/r10.png', category: 'Forum & Sözlük Siteleri' },
    { id: 'shiftdelete', name: 'ShiftDelete.Net Forum', logo: '/logos/shiftdelete.png', category: 'Forum & Sözlük Siteleri' }
  ],
  'Video & Yayın Platformları': [
    { id: 'youtube_live', name: 'YouTube', logo: '/logos/youtube.png', category: 'Video & Yayın Platformları' },
    { id: 'twitch', name: 'Twitch', logo: '/logos/twitch.png', category: 'Video & Yayın Platformları' },
    { id: 'dailymotion', name: 'Dailymotion', logo: '/logos/dailymotion.png', category: 'Video & Yayın Platformları' },
    { id: 'vimeo', name: 'Vimeo', logo: '/logos/vimeo.png', category: 'Video & Yayın Platformları' },
    { id: 'periscope', name: 'Periscope', logo: '/logos/periscope.png', category: 'Video & Yayın Platformları' }
  ],
  'Blog & İçerik Platformları': [
    { id: 'medium', name: 'Medium', logo: '/logos/medium.png', category: 'Blog & İçerik Platformları' },
    { id: 'blogger', name: 'Blogger', logo: '/logos/blogger.png', category: 'Blog & İçerik Platformları' },
    { id: 'wordpress', name: 'Wordpress Blogları', logo: '/logos/wordpress.png', category: 'Blog & İçerik Platformları' },
    { id: 'onedio', name: 'Onedio', logo: '/logos/onedio.png', category: 'Blog & İçerik Platformları' },
    { id: 'webtekno', name: 'Webtekno', logo: '/logos/webtekno.png', category: 'Blog & İçerik Platformları' },
    { id: 'tumblr', name: 'Tumblr', logo: '/logos/tumblr.png', category: 'Blog & İçerik Platformları' },
    { id: 'squarespace', name: 'Squarespace Blogları', logo: '/logos/squarespace.png', category: 'Blog & İçerik Platformları' }
  ],
  'Anlık Haber & İhbar Platformları': [
    { id: 'telegram', name: 'Telegram Kanalları', logo: '/logos/telegram.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'whatsapp', name: 'WhatsApp Grupları', logo: '/logos/whatsapp.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'discord', name: 'Discord Sunucuları', logo: '/logos/discord.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'signal', name: 'Signal Grupları', logo: '/logos/signal.png', category: 'Anlık Haber & İhbar Platformları' },
    { id: 'reddit', name: 'Reddit (Subreddit\'ler)', logo: '/logos/reddit.png', category: 'Anlık Haber & İhbar Platformları' }
  ],
  'Eğlence & Magazin Siteleri': [
    { id: 'onedio_magazin', name: 'Onedio', logo: '/logos/onedio.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'acunn', name: 'Acunn', logo: '/logos/acunn.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'medyatava', name: 'MedyaTava', logo: '/logos/medyatava.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'raninitv', name: 'RaniniTV', logo: '/logos/raninitv.png', category: 'Eğlence & Magazin Siteleri' },
    { id: 'magazinnot', name: 'MagazinNot', logo: '/logos/magazinnot.png', category: 'Eğlence & Magazin Siteleri' }
  ]
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isMediaSourcesOpen, setIsMediaSourcesOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isEditingSelected, setIsEditingSelected] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<('positive' | 'negative' | 'neutral')[]>([]);
  const [sentimentAnchorEl, setSentimentAnchorEl] = useState<null | HTMLElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const FETCH_COOLDOWN = 2000; // 2 saniye bekleme süresi
  const [isSearching, setIsSearching] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(!hasNewsApiKey());
  const [fetchError, setFetchError] = useState('');
  const { activeAccount } = useContext(AppContext);

  useEffect(() => {
    const handleApiKeyUpdate = () => {
      setApiKeyMissing(!hasNewsApiKey());
      setFetchError('');
    };

    window.addEventListener(NEWS_API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
    return () => window.removeEventListener(NEWS_API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
  }, []);

  const fetchPosts = React.useCallback(async () => {
    console.log('Fetch Posts Called with:', {
      selectedSources,
      activeAccountKeywords: activeAccount?.keywords,
      lastFetchTime,
      currentTime: Date.now()
    });

    if (selectedSources.length === 0) {
      console.warn('No sources selected, skipping fetch');
      setPosts([]);
      setFetchError('');
      return;
    }

    if (!hasNewsApiKey()) {
      setApiKeyMissing(true);
      setPosts([]);
      setFetchError('News API anahtarı gerekli. Ayarlar > Genel bölümünden anahtarınızı girin.');
      return;
    }

    setApiKeyMissing(false);
    setFetchError('');
    setLoading(true);
    try {
      const currentTime = Date.now();
      if (currentTime - lastFetchTime < FETCH_COOLDOWN) {
        console.warn(`Fetch blocked by cooldown. Time since last fetch: ${currentTime - lastFetchTime}ms`);
        return;
      }
      setLastFetchTime(currentTime);

      const queryParams = new URLSearchParams();
      
      // Her zaman seçili kaynakları ekle, boş bile olsa
      selectedSources.forEach(sourceId => queryParams.append('sources[]', sourceId));
      
      // Keywords'leri ekle
      const keywords = activeAccount?.keywords || [];
      if (keywords.length > 0) {
        keywords.forEach(keyword => queryParams.append('keywords[]', keyword));
      } else {
        queryParams.append('keywords[]', 'gündem');
      }

      console.log('Fetching posts with params:', queryParams.toString());
      
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/posts?${queryParams.toString()}`, {
          headers: buildApiHeaders(),
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
        setFetchError('Haberler alınırken bir bağlantı hatası oluştu.');
        return;
      }

      const data = await response.json();
      console.log('Received posts:', data);

      if (!response.ok) {
        const errorMessage = data.error || `HTTP error! status: ${response.status}`;
        setFetchError(errorMessage);
        setPosts([]);
        return;
      }
      
      if (data.error) {
        console.error('API error:', data.error);
        setFetchError(data.error);
        setPosts([]);
      } else {
        setFetchError('');
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setFetchError('Haberler alınırken beklenmeyen bir hata oluştu.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSources, lastFetchTime, activeAccount?.keywords]);

  useEffect(() => {
    // İlk yükleme için fetchPosts'u çağır
    fetchPosts();
  }, [fetchPosts, activeAccount]);

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleFilterToggle = (sourceId: string) => {
    setActiveFilters(prev =>
      prev.includes(sourceId)
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const getSourceById = (sourceId: string): MediaSource | undefined => {
    for (const category in mediaSources) {
      const source = mediaSources[category].find(s => s.id === sourceId);
      if (source) return source;
    }
    return undefined;
  };

  const handleSearch: () => Promise<void> = async () => {
    setIsSearching(true);
    try {
      // Force a new fetch by resetting lastFetchTime
      setLastFetchTime(0);
      
      // Trigger fetchPosts with current state
      await fetchPosts();
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Medya kaynakları paneli kapandığında fetch işlemini tetikle
  useEffect(() => {
    if (!isMediaSourcesOpen && selectedSources.length > 0) {
      fetchPosts();
    }
  }, [isMediaSourcesOpen, selectedSources.length]);

  return (
    <Box sx={{ p: 3 }}>
      <Box className="flex justify-between items-center mb-6">
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: 40,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: 'primary.main'
            }
          }}
        >
          Genel Bakış
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={isSearching || selectedSources.length === 0}
            sx={{
              height: 48,
              borderRadius: 2,
              backgroundColor: isSearching ? 'grey.400' : 'primary.main',
              '&:hover': {
                backgroundColor: isSearching ? 'grey.500' : 'primary.dark',
              }
            }}
          >
            {isSearching ? 'Aranıyor...' : 'Ara'}
          </Button>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => setIsMediaSourcesOpen(!isMediaSourcesOpen)}
            className="whitespace-nowrap"
            sx={{
              height: 48,
              borderRadius: 2,
              backgroundColor: isMediaSourcesOpen ? 'primary.main' : 'background.paper',
              color: isMediaSourcesOpen ? 'common.white' : 'text.primary',
              border: '1px solid',
              borderColor: isMediaSourcesOpen ? 'primary.main' : 'divider',
              boxShadow: isMediaSourcesOpen ? 4 : 'none',
              '&:hover': {
                backgroundColor: isMediaSourcesOpen ? 'primary.dark' : 'background.default',
                transform: 'translateY(-2px)',
                boxShadow: 6
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Medya Kaynakları {selectedSources.length > 0 && `(${selectedSources.length})`}
          </Button>
        </Box>
      </Box>

      {(apiKeyMissing || fetchError) && (
        <Alert
          severity={apiKeyMissing ? 'warning' : 'error'}
          sx={{ mb: 3 }}
          action={
            apiKeyMissing ? (
              <Button color="inherit" size="small" component={RouterLink} to="/settings">
                Ayarlara Git
              </Button>
            ) : undefined
          }
        >
          {fetchError || 'News API anahtarı gerekli. Ayarlar > Genel bölümünden anahtarınızı girin.'}
        </Alert>
      )}

      {selectedSources.length === 0 && (
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 8,
            px: 4
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2,
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            Henüz medya kaynağı seçilmedi
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              color: 'text.secondary'
            }}
          >
            Lütfen takip etmek istediğiniz medya kaynaklarını seçin
          </Typography>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => setIsMediaSourcesOpen(true)}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              backgroundColor: 'primary.main',
              color: 'common.white',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: 3
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Medya Kaynakları
          </Button>
        </Box>
      )}

      {selectedSources.length > 0 && (
        <Box 
          className="mb-6"
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)'
          }}
        >
          <Box className="flex justify-between items-center mb-3">
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Seçili Medya Kaynakları {activeFilters.length > 0 && `(${activeFilters.length} aktif filtre)`}
            </Typography>
            <Button
              variant={isEditingSelected ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setIsEditingSelected(!isEditingSelected);
                if (isEditingSelected) {
                  setActiveFilters([]);
                }
              }}
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              {isEditingSelected ? 'Düzenlemeyi Bitir' : 'Düzenle'}
            </Button>
          </Box>
          <Box className="flex flex-wrap gap-2">
            {selectedSources.map((sourceId) => {
              const source = getSourceById(sourceId);
              if (!source) return null;
              const isActive = activeFilters.includes(sourceId);
              return (
                <Button
                  key={sourceId}
                  sx={{
                    minWidth: 'auto',
                    height: 40,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'background.paper',
                    border: '1px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.2s ease-in-out',
                    color: isActive ? 'common.white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isEditingSelected 
                        ? alpha('#f44336', 0.04)
                        : isActive 
                          ? 'primary.dark'
                          : alpha(theme.palette.primary.main, 0.08),
                      transform: isEditingSelected ? 'none' : 'translateY(-1px)',
                      boxShadow: isEditingSelected ? 'none' : 1,
                      '& .delete-icon': {
                        opacity: 1
                      }
                    }
                  }}
                  onClick={() => {
                    if (isEditingSelected) {
                      handleSourceToggle(sourceId);
                    } else {
                      handleFilterToggle(sourceId);
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: getSourceColor(sourceId),
                      color: 'white',
                      border: 'none',
                      boxShadow: isActive 
                        ? `0 2px 8px ${alpha(getSourceColor(sourceId), 0.4)}` 
                        : '0 1px 3px rgba(0,0,0,0.12)',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {getInitial(source.name)}
                  </Avatar>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: isActive ? 'inherit' : 'text.primary',
                      fontWeight: isActive ? 600 : 500
                    }}
                  >
                    {source.name}
                  </Typography>
                  {isEditingSelected && (
                    <CloseIcon 
                      className="delete-icon"
                      sx={{ 
                        fontSize: 18,
                        ml: 0.5,
                        color: 'error.main',
                        opacity: 0.5,
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    />
                  )}
                </Button>
              );
            })}
          </Box>
        </Box>
      )}

      {selectedKeywords.length > 0 && (
        <Box className="flex flex-wrap gap-2 mb-6">
          {selectedKeywords.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              onDelete={() => setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))}
              sx={{
                borderRadius: 3,
                backgroundColor: 'primary.main',
                color: 'common.white',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'primary.dark'
                },
                '& .MuiChip-deleteIcon': {
                  color: 'common.white',
                  '&:hover': {
                    color: 'common.white',
                    opacity: 0.8
                  }
                }
              }}
            />
          ))}
        </Box>
      )}

      <Collapse in={isMediaSourcesOpen}>
        <Card 
          className="mb-6"
          elevation={0}
          sx={{
            borderRadius: 4,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {Object.entries(mediaSources).map(([category, sources]) => (
              <Box key={category} className="mb-8 last:mb-0">
                <Typography 
                  variant="h6" 
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: 'text.primary',
                    pl: 1
                  }}
                >
                  {category}
                </Typography>
                <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {sources.map((source) => (
                    <Button
                      key={source.id}
                      onClick={() => handleSourceToggle(source.id)}
                      className="h-16 normal-case flex items-center justify-start px-4 gap-3"
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        backgroundColor: selectedSources.includes(source.id)
                          ? 'primary.main'
                          : 'background.paper',
                        color: selectedSources.includes(source.id)
                          ? 'common.white'
                          : 'text.primary',
                        border: '1px solid',
                        borderColor: selectedSources.includes(source.id)
                          ? 'primary.main'
                          : 'divider',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: selectedSources.includes(source.id)
                            ? 'primary.dark'
                            : 'background.paper',
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          backgroundColor: getSourceColor(source.id),
                          color: 'white',
                          border: 'none',
                          boxShadow: selectedSources.includes(source.id)
                            ? `0 4px 12px ${alpha(getSourceColor(source.id), 0.4)}`
                            : '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: `0 4px 12px ${alpha(getSourceColor(source.id), 0.5)}`,
                          },
                        }}
                      >
                        {getInitial(source.name)}
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        className="truncate flex-grow text-left"
                        sx={{
                          fontWeight: selectedSources.includes(source.id) ? 600 : 400
                        }}
                      >
                        {source.name}
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Collapse>

      {selectedSources.length > 0 && (
        <Box className="mt-6">
          <Box className="flex justify-between items-center mb-3">
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                pl: 1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: 32,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: 'primary.main'
                }
              }}
            >
              Gönderiler {activeFilters.length > 0 && `(${activeFilters.length} kaynak filtrelendi)`}
              {sentimentFilter.length > 0 && ` (${sentimentFilter.length} duygu durumu filtrelendi)`}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SentimentSatisfiedAltIcon />}
              onClick={(e) => setSentimentAnchorEl(e.currentTarget)}
            >
              Duygu Durumu Filtrele
            </Button>
          </Box>
          <List sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              posts
                .filter(post => activeFilters.length === 0 || activeFilters.includes(post.sourceId))
                .filter(post => sentimentFilter.length === 0 || sentimentFilter.includes(post.sentiment))
                .map(post => {
                  const source = getSourceById(post.sourceId);
                  return source ? (
                    <Card 
                      key={post.id} 
                      className="mb-4"
                      elevation={0}
                      sx={{
                        borderRadius: 4,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          backgroundColor: post.sentiment === 'positive' 
                            ? theme.palette.success.main 
                            : post.sentiment === 'negative' 
                              ? theme.palette.error.main 
                              : theme.palette.grey[400],
                          borderTopLeftRadius: 16,
                          borderBottomLeftRadius: 16,
                          opacity: 0.85,
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `0 0 6px ${post.sentiment === 'positive' 
                            ? alpha(theme.palette.success.main, 0.25)
                            : post.sentiment === 'negative'
                              ? alpha(theme.palette.error.main, 0.25)
                              : alpha(theme.palette.grey[400], 0.25)}`,
                        },
                        '&:hover::before': {
                          opacity: 1,
                          width: 5,
                          boxShadow: `0 0 8px ${post.sentiment === 'positive'
                            ? alpha(theme.palette.success.main, 0.35)
                            : post.sentiment === 'negative'
                              ? alpha(theme.palette.error.main, 0.35)
                              : alpha(theme.palette.grey[400], 0.35)}`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1 }}>
                          <CardHeader
                            avatar={
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  fontSize: '1.1rem',
                                  fontWeight: 600,
                                  backgroundColor: getSourceColor(post.sourceId),
                                  color: 'white',
                                  border: 'none',
                                  boxShadow: `0 2px 8px ${alpha(getSourceColor(post.sourceId), 0.3)}`,
                                  transition: 'all 0.2s ease-in-out',
                                }}
                              >
                                {getInitial(source.name)}
                              </Avatar>
                            }
                            title={
                              <Typography 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: 'text.primary',
                                  fontSize: '1.1rem',
                                  mb: 0.5
                                }}
                              >
                                {source.name}
                              </Typography>
                            }
                            subheader={
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'text.secondary',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {new Date(post.date).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            }
                          />
                          <CardContent sx={{ pt: 0 }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: 'text.primary',
                                lineHeight: 1.6,
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: '3',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {post.content}
                            </Typography>
                            {post.content.length > 280 && (
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => window.open(post.sourceUrl, '_blank')}
                                sx={{ mb: 2, textTransform: 'none' }}
                              >
                                Devamını Oku
                              </Button>
                            )}
                            <Box className="flex items-center gap-2">
                              <Chip
                                label={post.sentiment === 'positive' ? 'Pozitif' : post.sentiment === 'negative' ? 'Negatif' : 'Nötr'}
                                color={post.sentiment === 'positive' ? 'success' : post.sentiment === 'negative' ? 'error' : 'default'}
                                size="small"
                                sx={{
                                  borderRadius: 3,
                                  height: 26,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  letterSpacing: '0.02em',
                                  backgroundColor: post.sentiment === 'positive'
                                    ? alpha(theme.palette.success.main, 0.12)
                                    : post.sentiment === 'negative'
                                      ? alpha(theme.palette.error.main, 0.12)
                                      : alpha(theme.palette.grey[500], 0.12),
                                  color: post.sentiment === 'positive'
                                    ? theme.palette.success.main
                                    : post.sentiment === 'negative'
                                      ? theme.palette.error.main
                                      : theme.palette.grey[600],
                                  border: '1px solid',
                                  borderColor: post.sentiment === 'positive'
                                    ? alpha(theme.palette.success.main, 0.24)
                                    : post.sentiment === 'negative'
                                      ? alpha(theme.palette.error.main, 0.24)
                                      : alpha(theme.palette.grey[500], 0.24),
                                  '&:hover': {
                                    backgroundColor: post.sentiment === 'positive'
                                      ? alpha(theme.palette.success.main, 0.2)
                                      : post.sentiment === 'negative'
                                        ? alpha(theme.palette.error.main, 0.2)
                                        : alpha(theme.palette.grey[500], 0.2),
                                  },
                                  '& .MuiChip-label': {
                                    px: 1.5,
                                  },
                                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                              />
                              <Box className="flex gap-2 ml-auto">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<LinkIcon />}
                                  onClick={() => window.open(post.sourceUrl, '_blank')}
                                  sx={{ borderRadius: 2 }}
                                >
                                  Kaynağa Git
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  startIcon={<ReportIcon />}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const menu = document.createElement('div');
                                    menu.style.position = 'fixed';
                                    menu.style.backgroundColor = theme.palette.background.paper;
                                    menu.style.padding = '1rem';
                                    menu.style.borderRadius = '8px';
                                    menu.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                                    menu.style.zIndex = '1000';
                                    menu.innerHTML = `
                                      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                        <a href="https://www.btk.gov.tr/iletisim" target="_blank" style="text-decoration: none; color: inherit;">
                                          <button style="width: 100%; padding: 0.5rem; text-align: left; border: none; background: none; cursor: pointer; border-radius: 4px; &:hover { background: ${theme.palette.action.hover} }">
                                            BTK'ya Bildir
                                          </button>
                                        </a>
                                        <a href="https://dbs.iletisim.gov.tr" target="_blank" style="text-decoration: none; color: inherit;">
                                          <button style="width: 100%; padding: 0.5rem; text-align: left; border: none; background: none; cursor: pointer; border-radius: 4px; &:hover { background: ${theme.palette.action.hover} }">
                                            İLETİŞİM'e Bildir
                                          </button>
                                        </a>
                                        <a href="https://www.egm.gov.tr/siber" target="_blank" style="text-decoration: none; color: inherit;">
                                          <button style="width: 100%; padding: 0.5rem; text-align: left; border: none; background: none; cursor: pointer; border-radius: 4px; &:hover { background: ${theme.palette.action.hover} }">
                                            Siber Suçlar'a Bildir
                                          </button>
                                        </a>
                                      </div>
                                    `;
                                    document.body.appendChild(menu);
                                    
                                    const rect = event.currentTarget.getBoundingClientRect();
                                    menu.style.top = `${rect.bottom + 5}px`;
                                    menu.style.left = `${rect.left}px`;
                                    
                                    const closeMenu = (e: MouseEvent) => {
                                      if (!menu.contains(e.target as Node)) {
                                        document.body.removeChild(menu);
                                        document.removeEventListener('click', closeMenu);
                                      }
                                    };
                                    
                                    setTimeout(() => {
                                      document.addEventListener('click', closeMenu);
                                    }, 0);
                                  }}
                                  sx={{ borderRadius: 2 }}
                                >
                                  Bildir
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Box>
                        <Box 
                          sx={{
                            width: 280,
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: alpha(theme.palette.background.default, 0.5)
                          }}
                        >
                          <Box className="flex flex-col items-center text-center">
                            <Avatar 
                              src={post.author.avatar || '/avatars/default.png'}
                              sx={{
                                width: 64,
                                height: 64,
                                mb: 2,
                                border: '2px solid',
                                borderColor: 'primary.main'
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Typography 
                              variant="subtitle1"
                              sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0.5
                              }}
                            >
                              {post.author.name}
                            </Typography>
                            <Box className="flex items-center gap-3 mt-2">
                              {post.author.followers !== undefined && (
                                <Box className="text-center">
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: 'text.primary',
                                      fontWeight: 600
                                    }}
                                  >
                                    {post.author.followers.toLocaleString()}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      display: 'block'
                                    }}
                                  >
                                    Takipçi
                                  </Typography>
                                </Box>
                              )}
                              {post.author.posts !== undefined && (
                                <Box className="text-center">
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: 'text.primary',
                                      fontWeight: 600
                                    }}
                                  >
                                    {post.author.posts.toLocaleString()}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      display: 'block'
                                    }}
                                  >
                                    Gönderi
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  ) : null;
                })
            )}
          </List>
        </Box>
      )}

      <Menu
        anchorEl={sentimentAnchorEl}
        open={Boolean(sentimentAnchorEl)}
        onClose={() => setSentimentAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            width: 220,
            maxHeight: '70vh',
            overflowY: 'auto'
          }
        }}
      >
        <MenuItem
          onClick={() => {
            const newSentimentFilter = sentimentFilter.includes('positive')
              ? sentimentFilter.filter(s => s !== 'positive')
              : [...sentimentFilter, 'positive'] as ('positive' | 'negative' | 'neutral')[];
            setSentimentFilter(newSentimentFilter);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Checkbox
            checked={sentimentFilter.includes('positive')}
            sx={{ pointerEvents: 'none' }}
          />
          <Typography>Pozitif</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const newSentimentFilter = sentimentFilter.includes('negative')
              ? sentimentFilter.filter(s => s !== 'negative')
              : [...sentimentFilter, 'negative'] as ('positive' | 'negative' | 'neutral')[];
            setSentimentFilter(newSentimentFilter);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Checkbox
            checked={sentimentFilter.includes('negative')}
            sx={{ pointerEvents: 'none' }}
          />
          <Typography>Negatif</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const newSentimentFilter = sentimentFilter.includes('neutral')
              ? sentimentFilter.filter(s => s !== 'neutral')
              : [...sentimentFilter, 'neutral'] as ('positive' | 'negative' | 'neutral')[];
            setSentimentFilter(newSentimentFilter);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Checkbox
            checked={sentimentFilter.includes('neutral')}
            sx={{ pointerEvents: 'none' }}
          />
          <Typography>Nötr</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Dashboard; 