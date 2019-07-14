 CREATE VIEW `all` AS (SELECT Users_Skills.net_id, (COUNT(*) / (SELECT COUNT(*) FROM Groups_Skills WHERE Groups_Skills.group_id = 3) * 100) AS skill_ratio
	 FROM must, Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Users_Skills.net_id = must.net_id and Groups_Skills.group_id = 3
	 GROUP BY Users_Skills.net_id
	 )
     
-- SELECT * 
-- FROM Users NATURAL JOIN `all`
-- ORDER BY internal_point DESC, ratio DESC
