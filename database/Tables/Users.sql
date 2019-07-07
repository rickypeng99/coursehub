CREATE TABLE IF NOT EXISTS CourseHub.Users (
    net_id VARCHAR(8) NOT NULL,
    internal_point INT NOT NULL,
    major VARCHAR(31) NOT NULL,
    user_name VARCHAR(31) NOT NULL,
    password VARCHAR(31) NOT NULL,
    first_name VARCHAR(31) NOT NULL,
    middle_name VARCHAR(31),
    last_name VARCHAR(31) NOT NULL,
    description TEXT,
    PRIMARY KEY (net_id)
)  ENGINE=INNODB;