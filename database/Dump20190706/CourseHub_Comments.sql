CREATE TABLE IF NOT EXISTS CourseHub.Comments (
	comment_id INT AUTO_INCREMENT,
    efficiency INT NOT NULL,
    responsiveness INT NOT NULL,
    communication INT NOT NULL,
    content TEXT,
    course_CRN INT NOT NULL,
    user_id VARCHAR(8),
    FOREIGN KEY (user_id)
		REFERENCES CourseHub.Users(net_id),
	PRIMARY KEY (comment_id)
) ENGINE=INNODB;
    