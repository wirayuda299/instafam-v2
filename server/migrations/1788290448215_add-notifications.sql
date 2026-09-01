-- Up Migration

CREATE TABLE notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id varchar(100) NOT NULL,
    actor_id varchar(100) NOT NULL,
    type varchar(20) NOT NULL,
    post_id uuid,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_notification_recipient FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_actor FOREIGN KEY(actor_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_post FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX notifications_recipient_idx ON notifications(recipient_id, created_at DESC);

-- Down Migration

DROP TABLE IF EXISTS notifications;
