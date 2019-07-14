CREATE OR REPLACE VIEW `must` AS (SELECT Users_Skills.net_id
	 FROM Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Groups_Skills.must = 1 and Groups_Skills.group_id = 8
	 GROUP BY Users_Skills.net_id
	 HAVING COUNT(*) = (SELECT COUNT(*) FROM Groups_Skills WHERE Groups_Skills.must = 1 and Groups_Skills.group_id = 8)
	 );
 CREATE OR REPLACE VIEW `all` AS (SELECT Users_Skills.net_id, ROUND((COUNT(*) / (SELECT COUNT(*) FROM Groups_Skills WHERE Groups_Skills.group_id = 8) * 100), 0) AS skill_ratio
	 FROM must, Groups_Skills, Users_Skills
	 WHERE Groups_Skills.skill = Users_Skills.skill and Users_Skills.net_id = must.net_id and Groups_Skills.group_id = 8
	 GROUP BY Users_Skills.net_id
	 );
SET @average := (SELECT AVG(U.internal_point) FROM Groups_Users AS GU, Users AS U WHERE GU.net_id = U.net_id and GU.group_id = 8);
SET @CRN := (SELECT course_CRN FROM Groups WHERE group_id = 8);

(SELECT *, ROUND((SELECT GREATEST(500 - Abs(Users.internal_point - @average),0)) * 0.2 * 0.4 + 0.6 * `all`.skill_ratio, 2) AS matching_ratio
FROM Users NATURAL JOIN `all`
WHERE Users.net_id not in (SELECT net_id FROM Groups_Users WHERE group_id = 8) and Users.net_id in (SELECT user_id FROM Users_Matching_Queue WHERE course_CRN = @CRN)
ORDER BY matching_ratio DESC,`all`.skill_ratio DESC, Users.first_name DESC);

DROP VIEW `must`;
DROP VIEW `all`;

