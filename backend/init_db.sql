-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS social_listening;
USE social_listening;

-- Keywords ve varsayılan anahtar kelimeler kaldırıldı

    ('ekonomi', 1),
    ('teknoloji', 1),
    ('siyaset', 1),
    ('spor', 1),
    ('eğitim', 1),
    ('sağlık', 1)
ON DUPLICATE KEY UPDATE is_active = 1; 