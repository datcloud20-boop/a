SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50), 
  `email` VARCHAR(100) UNIQUE, 
  `password` VARCHAR(255), 
  `role` VARCHAR(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(50) PRIMARY KEY, 
  `setting_value` LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` VARCHAR(50) PRIMARY KEY, 
  `name` VARCHAR(100), 
  `email` VARCHAR(100), 
  `service` VARCHAR(100), 
  `brief` TEXT, 
  `timestamp` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SERVICE TABLES
CREATE TABLE IF NOT EXISTS `video_editing` (
  `id` VARCHAR(50) PRIMARY KEY, `title` VARCHAR(255), `status` VARCHAR(50), `tags` TEXT, `image_url` LONGTEXT, `main_media_url` LONGTEXT, `description` TEXT, `website_link` VARCHAR(255), `drive_link` VARCHAR(255), `client` VARCHAR(100), `year` VARCHAR(10), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `thumbnail_design` (
  `id` VARCHAR(50) PRIMARY KEY, `title` VARCHAR(255), `status` VARCHAR(50), `tags` TEXT, `image_url` LONGTEXT, `main_media_url` LONGTEXT, `description` TEXT, `website_link` VARCHAR(255), `drive_link` VARCHAR(255), `client` VARCHAR(100), `year` VARCHAR(10), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `web_development` (
  `id` VARCHAR(50) PRIMARY KEY, `title` VARCHAR(255), `status` VARCHAR(50), `tags` TEXT, `image_url` LONGTEXT, `main_media_url` LONGTEXT, `description` TEXT, `website_link` VARCHAR(255), `drive_link` VARCHAR(255), `client` VARCHAR(100), `year` VARCHAR(10), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchandise_design` (
  `id` VARCHAR(50) PRIMARY KEY, `title` VARCHAR(255), `status` VARCHAR(50), `tags` TEXT, `image_url` LONGTEXT, `main_media_url` LONGTEXT, `description` TEXT, `website_link` VARCHAR(255), `drive_link` VARCHAR(255), `client` VARCHAR(100), `year` VARCHAR(10), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `poster_design` (
  `id` VARCHAR(50) PRIMARY KEY, `title` VARCHAR(255), `status` VARCHAR(50), `tags` TEXT, `image_url` LONGTEXT, `main_media_url` LONGTEXT, `description` TEXT, `website_link` VARCHAR(255), `drive_link` VARCHAR(255), `client` VARCHAR(100), `year` VARCHAR(10), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;