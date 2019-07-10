CREATE OR REPLACE VIEW `must` AS (SELECT Users_Skills.net_id
	 FROM Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Groups_Skills.must = 1 and Groups_Skills.group_id = 999
	 GROUP BY Users_Skills.net_id
	 HAVING COUNT(*) = (SELECT COUNT(*) FROM Groups_Skills WHERE Groups_Skills.must = 1 and Groups_Skills.group_id = 999)
	 );
 CREATE OR REPLACE VIEW `all` AS (SELECT Users_Skills.net_id, ROUND((COUNT(*) / (SELECT COUNT(*) FROM Groups_Skills WHERE Groups_Skills.group_id = 999) * 100), 0) AS skill_ratio
	 FROM must, Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Users_Skills.net_id = must.net_id and Groups_Skills.group_id = 999
	 GROUP BY Users_Skills.net_id
	 );
SET @average := (SELECT AVG(U.internal_point) FROM Groups_Users AS GU, Users AS U WHERE GU.net_id = U.net_id and GU.group_id = 999);
(SELECT *, ROUND((SELECT GREATEST(250 - Abs(Users.internal_point - @average),0)) * 0.4 * 0.4 + 0.6 * `all`.skill_ratio, 2) AS matching_ratio
FROM Users NATURAL JOIN `all`
WHERE Users.net_id not in (SELECT net_id FROM Groups_Users WHERE group_id = 3)
ORDER BY matching_ratio DESC, Users.internal_point DESC, `all`.skill_ratio DESC);

DROP VIEW `must`;
DROP VIEW `all`;

