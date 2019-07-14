SET @average := (SELECT AVG(U.internal_point) FROM Groups_Users AS GU, Users AS U WHERE GU.net_id = U.net_id and GU.group_id = 3);
SELECT *, (SELECT GREATEST(250 - Abs(Users.internal_point - @average),0)) * 0.4 * 0.4 + 0.6 * `all`.skill_ratio AS matching_ratio
FROM Users NATURAL JOIN `all`
WHERE Users.net_id not in (SELECT net_id FROM Groups_Users WHERE group_id = 3)
ORDER BY matching_ratio DESC, Users.internal_point DESC, `all`.skill_ratio DESC