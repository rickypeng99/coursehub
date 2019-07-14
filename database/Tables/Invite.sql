CREATE TABLE IF NOT EXISTS CourseHub.Invite (
    group_id INT NOT NULL,
    net_id VARCHAR(8) NOT NULL,
    invite_id INT AUTO_INCREMENT,
    invite_status BOOL,
    FOREIGN KEY (group_id)
		REFERENCES CourseHub.Groups(group_id),
	FOREIGN KEY (net_id)
		REFERENCES CourseHub.Users(net_id),
	PRIMARY KEY (invite_id)
)  ENGINE=INNODB;