CREATE TABLE IF NOT EXISTS CourseHub.Groups_Skills (
    group_id INT,
    skill VARCHAR(31),
    FOREIGN KEY (group_id)
		REFERENCES CourseHub.Groups(group_id)
        ON DELETE CASCADE
)  ENGINE=INNODB;