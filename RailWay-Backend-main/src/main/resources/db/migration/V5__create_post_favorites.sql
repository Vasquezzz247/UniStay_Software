-- V5__create_post_favorites.sql

-- Tabla para guardar posts favoritos por usuario
CREATE TABLE IF NOT EXISTS public.post_favorites (
                                                     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamp(6) NOT NULL DEFAULT now(),

    CONSTRAINT uk_post_favorites_user_post UNIQUE (user_id, post_id),

    CONSTRAINT fk_post_favorites_user
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,

    CONSTRAINT fk_post_favorites_post
    FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE
    );
