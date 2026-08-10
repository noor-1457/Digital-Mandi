-- database/schema.sql
CREATE DATABASE digital_mandi;
USE digital_mandi;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    
    -- Role field with 3 options
    user_role ENUM('admin', 'farmer', 'buyer') NOT NULL DEFAULT 'buyer',
    
    -- Farmer specific fields (NULL for admin and buyer)
    farm_name VARCHAR(100),
    farm_location VARCHAR(100),
    primary_crop_type VARCHAR(50),
    
    -- Admin specific fields (if any)
    admin_level VARCHAR(50) DEFAULT 'basic',
    
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_role (user_role)
);