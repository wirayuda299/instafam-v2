CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table users (
id varchar(100) not null primary key,
username varchar(50) not null,
email varchar(100) not null,
profile_image text not null,
bio varchar(100) default ''
) 


create index username_index on users using gin(to_tsvector('indonesian',username))

create table user_settings(
userId varchar(100) not null,
show_saved_post boolean default false,
show_mention boolean default false,
show_draft_posts boolean default false,
constraint fk_user_id foreign key(userId) references users(id) on delete cascade

)

create table followers (
follower_id varchar(100) not null,
user_id varchar(100) not null,
primary key(follower_id, user_id),
constraint fk_user_id foreign key(user_id) 
references users(id) on delete cascade,
constraint fk_follower_id foreign key(follower_id) references users(id) on delete cascade
)

create table following (
following_id varchar(100) not null,
user_id varchar(100) not null,
primary key(following_id, user_id),
constraint fk_user_id foreign key(user_id) 
references users(id) on delete cascade,
constraint fk_following_id foreign key(following_id) references users(id) on delete cascade
)

create table posts(
id uuid default uuid_generate_v4() primary key,
author varchar(100) not null,
captions text default '',
media_url text,
media_asset_id varchar(50),
createdAt timestamp default CURRENT_TIMESTAMP,
 published boolean default true,
constraint fk_author_id foreign key(author) references users(id) on delete cascade
)


create table post_likes(
post_id uuid not null,
liked_by varchar(100) not null,
primary key(post_id, liked_by),
constraint fk_liked_by foreign key(liked_by) 
references users(id) on delete cascade,
constraint fk_post_like_id foreign key(post_id) 
references posts(id) on delete cascade
)

create table bookmarks(
author varchar(100) not null,
post_id uuid not null,
primary key(post_id, author),
constraint fk_bookmark_author foreign key(author) 
references users(id) on delete cascade,
constraint fk_bookmark_post_id foreign key(post_id) 
references posts(id) on delete cascade
)

create table conversations(
id uuid default uuid_generate_v4() primary key,
sender_id varchar(100) not null, 
recipient_id varchar(100) not null,
constraint fk_sender_id foreign key(sender_id) 
references users(id) on delete cascade,
constraint fk_recipient_id foreign key(recipient_id) 
references users(id) on delete cascade
)

CREATE TABLE messages (
   id uuid default uuid_generate_v4() primary key,
    content TEXT NOT NULL,
    attachment_url text,
    attachment_id varchar(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    author varchar(100) REFERENCES users(id) ON DELETE cascade,
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE
);

create table comments(
id uuid default uuid_generate_v4() primary key,
message text default '',
post_id uuid not null,
author varchar(100) not null,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
constraint fk_comment_post_id foreign key (post_id) references posts(id) on delete cascade,
constraint fk_comment_author foreign key(author) references users(id) on delete cascade
)

create table comment_likes(

comment_id uuid not null,
liked_by varchar(100) not null,
primary key(comment_id, liked_by),
constraint fk_comment_likes_id foreign key(comment_id) references comments(id) on delete cascade,
constraint fk_comment_liked_by_id foreign key(liked_by) references users(id) on delete cascade
)

create table report(
id uuid default uuid_generate_v4() primary key,
post_id uuid not null,
reason varchar(50)[],
reportedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
constraint fk_reported_post_id foreign key(post_id) references posts(id)

)






