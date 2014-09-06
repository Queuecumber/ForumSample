create database forum;

use forum;

create table user
(
    email varchar(255) not null,
    name varchar(255),
    password varchar(100) not null,
    primary key (email)
);

create table acl_permissions
(
    level int not null auto_increment,
    name varchar(255) not null,
    primary key(level)
);

create table board
(
    board_id int not null auto_increment,
    creator varchar(255) not null,
    title varchar(255) not null,
    default_permission int not null,
    parent_board_id int,
    primary key (board_id),
    foreign key (creator) references user(email),
    foreign key (parent_board_id) references board(board_id),
    foreign key (default_permission) references acl_permissions(level)
);

create table board_acl
(
    user varchar(255) not null,
    board_id int not null,
    permission int not null,
    constraint pk_board_acl primary key (user,board_id),
    foreign key (permission) references acl_permissions(level)
);

create table thread
(
    thread_id int not null auto_increment,
    creator varchar(255) not null,
    title varchar(255) not null,
    board_id int not null,
    primary key(thread_id),
    foreign key (creator) references user(email),
    foreign key (board_id) references board(board_id)
);

create table post
(
    creator varchar(255) not null,
    title varchar(255) not null,
    date datetime not null,
    body text not null,
    thread_id int not null,
    foreign key (creator) references user(email),
    foreign key (thread_id) references thread(thread_id)
);
