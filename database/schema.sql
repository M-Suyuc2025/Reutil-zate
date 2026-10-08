-- ============================================================================
-- Reutilízate — Esquema completo de la base de datos
-- ----------------------------------------------------------------------------
-- Este archivo documenta la estructura REAL de la base de datos del proyecto
-- "Reutilízate" (PostgreSQL). 
--
-- Las 6 tablas usan CREATE TABLE IF NOT EXISTS: el script es seguro tanto en
-- una base de datos vacía (crea todo) como en una que ya tiene las tablas
-- (no falla ni duplica nada).
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    accumulated_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    points_per_unit INTEGER NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    cost_points INTEGER NOT NULL,
    monthly_limit INTEGER,
    total_limit INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recycling_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    image_url VARCHAR(255),
    points_earned INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_material FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE RESTRICT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reuse_ideas (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    steps JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reuse_material FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS redemptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    reward_id INTEGER NOT NULL,
    points_spent INTEGER NOT NULL,
    confirmation_code VARCHAR(20) NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT redemptions_confirmation_code_key UNIQUE (confirmation_code),
    CONSTRAINT fk_redemption_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_redemption_reward FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE RESTRICT
);