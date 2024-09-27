CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(60) UNIQUE NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL,
    password VARCHAR(30) UNIQUE NOT NULL                           

);