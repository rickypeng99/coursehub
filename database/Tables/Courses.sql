CREATE TABLE IF NOT EXISTS CourseHub.Courses (
    CRN INT NOT NULL,
    dept VARCHAR(7) NOT NULL,
    idx INT NOT NULL,
    title VARCHAR(127) NOT NULL,
    special_title VARCHAR(127),
    credit INT,
    term VARCHAR(7),
    type VARCHAR(63),
    session VARCHAR(15),
    PRIMARY KEY (CRN)
)  ENGINE=INNODB;