SELECT net_id 
FROM CourseHub.Users_Skills 
WHERE skill = "pass-in1" AND net_id IN (SELECT user_id 
FROM CourseHub.Users_Matching_Queue
WHERE course_CRN = 99999);