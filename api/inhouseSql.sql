DROP DATABASE tutorgram;

CREATE DATABASE tutorgram;

CREATE TABLE users(
    username text not null,
    email text not null,
    account_type text not null,
    account_date text not null,
    user_pass text not null,
    user_id int not null PRIMARY KEY AUTO_INCREMENT           
);


CREATE TABLE posts(
    user_id int not null,
    post_type text not null,
    post_text text not null,
    post_url text not null,
    post_date text not null,
    post_time text not null,
    post_id int not null PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE user_images(
    user_id int not null,
    image_url text not null,
    `type` text not null,
    image_id int not null PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE follow(
    user_one_id int not null,
    user_two_id int not null,
    follow_type text not null,
    follow_state text not null,
    follow_date text not null,
    follow_id int not null PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE post_likes(
    user_id int not null,
    post_id int not null,
    like_id int not null PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE comments(
    user_id int not null,
    post_id int not null,
    comment_type text not null,
    comment_text text not null,
    comment_url text not null,
    comment_date text not null,
    comment_id int not null PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE bio(
    user_id int not null,
    user_location text not null,
    user_address text not null,
    user_numbers int not null,
    user_certs text not null,
    user_occupation text not null
);
--INSERT INTO users VALUES("maddox", "madd@gmail", "student", "20/3/4", "maddox", NULL);

CREATE TABLE tutor(
    user_id int not null,
    price text not null,
    location text not null,
    subject text not null,
    qualification text not null,
    qualification_file_url text not null,
    rating text not null,
    tutor_id int not null PRIMARY KEY AUTO_INCREMENT
);


CREATE TABLE messages(
    user_one_id int not null,
    user_two_id int not null,
    message_text text not null,
    message_url text not null,
    message_date text not null,
    message_seen int not null,
    message_id int not null PRIMARY KEY AUTO_INCREMENT
);


CREATE TABLE temp_messages(
    user_one_id int not null,
    user_two_id int not null,
    message_text text not null,
    temp_msg_id int not null PRIMARY KEY AUTO_INCREMENT
);


CREATE TABLE notifications(
    viewer_id int not null, /* Person Who Created The Notification, Liked, Commented etc */
    user_id int not null, /* Person Whom The Notification IS Directed To */
    post_id int not null,
    type text not null,
    notif_id int not null PRIMARY KEY AUTO_INCREMENT
);


CREATE TABLE requests(
    user_id int not null,
    tutor_id int not null,
    status text not null
    req_id int not null PRIMARY KEY AUTO_INCREMENT
);


CREATE TABLE reviews(
    user_id int not null,
    comment_id int not null,
    type text not null,
    review_id int not null PRIMARY KEY AUTO_INCREMENT
);
