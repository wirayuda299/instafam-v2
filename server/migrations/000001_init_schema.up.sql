CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id varchar(100) NOT NULL PRIMARY KEY,
    username varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    profile_image text NOT NULL,
    bio varchar(100) DEFAULT ''
);

CREATE INDEX username_index ON users USING gin(to_tsvector('indonesian', username));

CREATE TABLE user_settings (
    userId varchar(100) NOT NULL,
    show_saved_post boolean DEFAULT false,
    show_mention boolean DEFAULT false,
    show_draft_posts boolean DEFAULT false,
    CONSTRAINT fk_user_id FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE followers (
    follower_id varchar(100) NOT NULL,
    user_id varchar(100) NOT NULL,
    PRIMARY KEY(follower_id, user_id),
    CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_follower_id FOREIGN KEY(follower_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE following (
    following_id varchar(100) NOT NULL,
    user_id varchar(100) NOT NULL,
    PRIMARY KEY(following_id, user_id),
    CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_following_id FOREIGN KEY(following_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    author varchar(100) NOT NULL,
    captions text DEFAULT '',
    media_url text,
    media_asset_id varchar(50),
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    published boolean DEFAULT true,
    CONSTRAINT fk_author_id FOREIGN KEY(author) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE post_likes (
    post_id uuid NOT NULL,
    liked_by varchar(100) NOT NULL,
    PRIMARY KEY(post_id, liked_by),
    CONSTRAINT fk_liked_by FOREIGN KEY(liked_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_like_id FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE bookmarks (
    author varchar(100) NOT NULL,
    post_id uuid NOT NULL,
    PRIMARY KEY(post_id, author),
    CONSTRAINT fk_bookmark_author FOREIGN KEY(author) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_post_id FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE conversations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id varchar(100) NOT NULL,
    recipient_id varchar(100) NOT NULL,
    CONSTRAINT fk_sender_id FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recipient_id FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    attachment_url text,
    attachment_id varchar(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    author varchar(100) REFERENCES users(id) ON DELETE CASCADE,
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    message text DEFAULT '',
    post_id uuid NOT NULL,
    author varchar(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_post_id FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY(author) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comment_likes (
    comment_id uuid NOT NULL,
    liked_by varchar(100) NOT NULL,
    PRIMARY KEY(comment_id, liked_by),
    CONSTRAINT fk_comment_likes_id FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_liked_by_id FOREIGN KEY(liked_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE report (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id uuid NOT NULL,
    reason varchar(50)[],
    reportedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reported_post_id FOREIGN KEY(post_id) REFERENCES posts(id)
);
