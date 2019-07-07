## The original relational schema
 - Course(CRN, term, dept, name, Waitlist.id)
 - Unassigned(Course.CRN, numOfStudent)
 - Group(GroupId, CourseId, studentLimit, status, description, neededSkill, name, numOfstudent)
 - User(Skills, NetId, InternalPoints, major, username, password, firstName, lastName)
 - Comment(commentId, Report, Score, text, Course.CRN, User,netId(givenBy))
 - userGroup(User.netId, Group.GroupId)
 - userComment(User.netId, Comment.id)

## The current relational schema
  - Courses(CRN, dept, idx, title, special_title, credit, term, type, session)
  - Matching_Queues(Course.CRN, num_students)
  - Groups(GroupId, CourseId, studentLimit, status, description, name, numOfstudent)
  - Users(NetId, InternalPoints, major, username, password, firstName, lastName, description)
  - Groups_Skills(Groups.GroupId, Skill)
  - Students_Skills(Users.NetId, Skill)

# Changes
 - ADD and CHANGE multiple attributes in table "Courses"
 - CHANGE "Unassigned/Waitlist" to "matching_queue"
 - REMOVE "Waitlist.id" from table "Courses"
 - REMOVE "neededSkill" from table "Groups"
 - REMOVE "Skills" from table "Users"
 - ADD "description" to table "Users"
 - SET "GroupId" to "AUTO_INCREMENT"
 - ADD "Founder" to table "Groups" as foreign key

# TODO
 - ADD table "Groups_Users"
 - ADD table "Comment" and "userComment"
