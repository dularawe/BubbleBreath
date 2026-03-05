CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `email_verified` bit(1) NOT NULL DEFAULT b'0',
  `terms_accepted` bit(1) NOT NULL DEFAULT b'0',
  `coppa_confirmed` bit(1) NOT NULL DEFAULT b'0',
  `newsletter_subscribed` bit(1) NOT NULL DEFAULT b'0',
  `active` bit(1) NOT NULL DEFAULT b'1',
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0,
  `account_locked_until` datetime(6) DEFAULT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_token` (`token`),
  UNIQUE KEY `UK_user_id` (`user_id`),
  CONSTRAINT `FK_password_reset_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`full_name`, `email`, `password`, `country`, `email_verified`, `active`, `created_at`, `updated_at`) 
VALUES ('Test User', 'testuser@example.com', '$2a$10$wKfb1l6Wq9zX6iJ0b2k5mO8P0Z0xN8oKxZ8bH/Y6n6e8Pq8zX6iJ0', 'Sri Lanka', b'1', b'1', NOW(), NOW());
