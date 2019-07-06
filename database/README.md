## The relational schema (Original)
###Course(CRN, term, dept, name, Waitlist.id)

###Unassigned(Course.CRN, numOfStudent)

###Group(GroupId, CourseId, studentLimit, status, description, neededSkill, name, numOfstudent)

###User(Skills, NetId, InternalPoints, major, username, password, firstName, lastName)

###Comment(commentId, Report, Score, text, Course.CRN, User,netId(givenBy))

###userGroup(User.netId, Group.GroupId)

###userComment(User.netId, Comment.id)

## Changes
### Waitlist -> matching_queue
