CREATE TABLE users(
   username text not null,
   email text not null,
   date_creation text not null,
   user_password text not null,
   userId int not null PRIMARY KEY
);

INSERT INTO users VALUES("maddox", "ma@gmail", "20/10/23", "maddox", 1);
