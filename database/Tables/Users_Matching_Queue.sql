CREATE TABLE IF NOT EXISTS CourseHub.Users_Matching_Queue (
    course_CRN INT,
    user_id varchar(8) NOT NULL,
	FOREIGN KEY (user_id)
		REFERENCES CourseHub.Users(net_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_CRN)
		REFERENCES Courses(CRN)
        ON DELETE CASCADE
		
)  ENGINE=INNODB;