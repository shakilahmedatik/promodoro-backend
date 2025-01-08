CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    image VARCHAR(255) NOT NULL, -- To store the URL of the user's image
    password VARCHAR(255) NOT NULL, -- To store the hashed password
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    duration INT,
    timestamp TIMESTAMP DEFAULT NOW()
);
