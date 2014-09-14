create database forum;

use forum;

create table user
(
    email varchar(255) not null,
    name varchar(255),
    password varchar(100) not null,
    primary key (email)
);

create table acl_permission
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
    parent_board int,
    primary key (board_id),
    foreign key (creator) references user(email),
    foreign key (parent_board) references board(board_id),
    foreign key (default_permission) references acl_permission(level)
);

create table board_acl
(
    user varchar(255) not null,
    board int not null,
    permission int not null,
    constraint pk_board_acl primary key (user,board),
    foreign key (permission) references acl_permission(level),
    foreign key (user) references user(email),
    foreign key (board) references board(board_id)
);

create table thread
(
    thread_id int not null auto_increment,
    creator varchar(255) not null,
    title varchar(255) not null,
    board int not null,
    primary key(thread_id),
    foreign key (creator) references user(email),
    foreign key (board) references board(board_id)
);

create table post
(
    creator varchar(255) not null,
    title varchar(255) not null,
    date datetime not null,
    body text not null,
    thread int not null,
    foreign key (creator) references user(email),
    foreign key (thread) references thread(thread_id)
);
