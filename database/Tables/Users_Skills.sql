CREATE TABLE IF NOT EXISTS CourseHub.Users_Skills (
    net_id VARCHAR(8),
    skill VARCHAR(31),
    FOREIGN KEY (net_id)
		REFERENCES CourseHub.Users(net_id)
        ON DELETE CASCADE
)  ENGINE=INNODB;