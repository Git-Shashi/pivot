-- JobPilot initial schema

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    default_resume_id BIGINT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    cloudinary_public_id VARCHAR(500) NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

ALTER TABLE users
    ADD CONSTRAINT fk_users_default_resume
    FOREIGN KEY (default_resume_id) REFERENCES resumes(id) ON DELETE SET NULL;

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id BIGINT REFERENCES resumes(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    job_url VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'BOOKMARKED',
    applied_date DATE,
    salary_range VARCHAR(100),
    location VARCHAR(255),
    work_mode VARCHAR(20),
    notes TEXT,
    cover_letter TEXT,
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE application_rounds (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    round_type VARCHAR(30) NOT NULL,
    scheduled_at TIMESTAMP,
    result VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(255),
    linkedin_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE todo_items (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    due_date DATE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Composite indexes for common queries
CREATE INDEX idx_applications_user_status ON applications(user_id, status);
CREATE INDEX idx_applications_user_created ON applications(user_id, created_at DESC);
CREATE INDEX idx_rounds_application ON application_rounds(application_id, round_number);
CREATE INDEX idx_contacts_application ON contacts(application_id);
CREATE INDEX idx_todos_user_completed ON todo_items(user_id, is_completed);
CREATE INDEX idx_resumes_user ON resumes(user_id);
