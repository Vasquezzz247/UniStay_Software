CREATE TABLE IF NOT EXISTS reviews (
                                       id UUID PRIMARY KEY,
                                       post_id UUID NOT NULL,
                                       student_id UUID NOT NULL,
                                       rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_reviews_post
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,

    CONSTRAINT fk_reviews_student
    FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT uk_review_post_student UNIQUE (post_id, student_id)
    );