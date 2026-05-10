-- Projekti: Ndjekja e Shpenzimeve (Skema e plotë dhe e thjeshtë)

-- 1. Fshijmë tabelat nëse ekzistojnë (për të mos pasur gabime kur e ekzekuton disa herë)
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS incomes CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Krijimi i Tabelave
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    expense_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    income_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(user_id, category_id, month, year)
);

-- 4. Çaktivizojmë sigurinë RLS (Row Level Security) për ta bërë testimin sa më të thjeshtë pa pasur nevojë për Login
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;

-- 3. Të dhëna fillestare (Seed Data) për testim të thjeshtë
-- Krijojmë një përdorues test
INSERT INTO users (name, email) VALUES ('Përdoruesi Test', 'test@financaime.com');

-- Krijojmë disa kategori bazë për këtë përdorues (id e përdoruesit është 1)
INSERT INTO categories (user_id, name, type) VALUES 
(1, 'Ushqim', 'expense'),
(1, 'Transport', 'expense'),
(1, 'Qira', 'expense'),
(1, 'Fatura', 'expense'),
(1, 'Paga', 'income'),
(1, 'Bonus', 'income');
