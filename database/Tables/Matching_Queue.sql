CREATE TABLE IF NOT EXISTS CourseHub.Matching_Queue (
    course_CRN INT,
    number_students INT,
    PRIMARY KEY (course_CRN),
    FOREIGN KEY (course_CRN)
		REFERENCES Courses(CRN)
        ON DELETE CASCADE
		
)  ENGINE=INNODB;