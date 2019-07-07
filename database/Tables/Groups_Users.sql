CREATE TABLE IF NOT EXISTS CourseHub.Groups_Users (
    group_id INT,
    net_id VARCHAR(8),
    FOREIGN KEY (group_id)
		REFERENCES CourseHub.Groups(group_id)
        ON DELETE CASCADE,
	FOREIGN KEY (net_id)
		REFERENCES CourseHub.Users(net_id)
        ON DELETE CASCADE
)  ENGINE=INNODB;