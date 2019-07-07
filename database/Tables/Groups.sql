CREATE TABLE IF NOT EXISTS CourseHub.Groups (
    group_id INT AUTO_INCREMENT,
    founder VARCHAR(8) NOT NULL,
    name VARCHAR(31),
    course_CRN INT NOT NULL,
    students_limit INT,
    students_current INT,
    status bool, # close = 0, open = 1
    description TEXT,
    FOREIGN KEY (founder)
		REFERENCES CourseHub.Users(net_id)
        ON DELETE CASCADE,
    PRIMARY KEY (group_id)
		
)  ENGINE=INNODB;