SET @my_score := (SELECT internal_point FROM users WHERE net_id = "ysr6");

CREATE OR REPLACE VIEW `must` AS (SELECT Groups_Skills.group_id, COUNT(*)
	 FROM Groups_Skills NATURAL JOIN Users_Skills
	 WHERE Users_Skills.net_id = "ysr6" and Groups_Skills.must = 1
	 GROUP BY Groups_Skills.group_id
	 HAVING COUNT(*) = (SELECT COUNT(*) FROM Groups_Skills as temp WHERE temp.group_id = Groups_Skills.group_id and temp.must = 1)
	 );

 CREATE OR REPLACE VIEW `all` AS (SELECT Groups_Skills.group_id, ROUND((COUNT(*) / (SELECT COUNT(*) FROM Groups_Skills as temp WHERE temp.group_id = Groups_Skills.group_id) * 100), 0) AS skill_ratio
	 FROM must, Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Groups_Skills.group_id = must.group_id and Users_Skills.net_id = "ysr6"
	 GROUP BY Groups_Skills.group_id
	 );


(SELECT *, ROUND((SELECT GREATEST(500 - Abs(@my_score - (SELECT AVG(internal_point) FROM Users NATURAL JOIN Groups_Users where Groups_Users.group_id = Groups.group_id)),0)) * 0.2 * 0.4 + 0.6 * `all`.skill_ratio, 2) AS matching_ratio
FROM Groups NATURAL JOIN `all`
WHERE Groups.course_CRN = 30109
ORDER BY matching_ratio DESC,`all`.skill_ratio DESC, Groups.group_id DESC);
(SELECT AVG(internal_point) FROM Users NATURAL JOIN Groups_Users where Groups_Users.group_id = Groups.group_id);
DROP VIEW `must`;
DROP VIEW `all`;

