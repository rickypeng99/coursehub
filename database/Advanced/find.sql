 CREATE VIEW `must` AS (SELECT Users_Skills.net_id
	 FROM Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Groups_Skills.must = 1 and Groups_Skills.group_id = 3
	 GROUP BY Users_Skills.net_id
	 HAVING COUNT(*) = (SELECT COUNT(*) FROM Groups_Skills WHERE Groups_Skills.must = 1 and Groups_Skills.group_id = 3)
	 )
     
-- SELECT * FROM Users, must WHERE Users.net_id = must.net_id ORDER BY Users.internal_point DESC