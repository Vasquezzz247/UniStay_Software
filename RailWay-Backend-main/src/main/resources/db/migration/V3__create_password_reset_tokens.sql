-- V3__create_password_reset_tokens.sql

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
                                                            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    token varchar(200) NOT NULL UNIQUE,
    user_id uuid NOT NULL,
    expires_at timestamp(6) NOT NULL,
    used boolean NOT NULL DEFAULT false,
    CONSTRAINT fk_password_reset_user
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
    );
