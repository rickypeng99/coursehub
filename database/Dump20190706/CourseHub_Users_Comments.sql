CREATE TABLE IF NOT EXISTS CourseHub.Users_Comments (
    net_id VARCHAR(8) NOT NULL,
    comment_id INT NOT NULL,
    FOREIGN KEY (net_id)
		REFERENCES CourseHub.Users(net_id),
	FOREIGN KEY (comment_id)
		REFERENCES CourseHub.Comments(comment_id)
)  ENGINE=INNODB;