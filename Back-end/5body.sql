CREATE TABLE student (
    studentid INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(255),
    medal VARCHAR(255), /*勋章，设定我们有N个勋章，它们都按编号排开，这个字符串则记录该学生所有勋章的编号，以","隔开*/
    profile_photo BLOB
);
CREATE TABLE class (
  classid INT PRIMARY KEY,
  class_time VARCHAR(50), /*因为课程每周都会举行，所以存的格式为 "星期 时间"用","隔开*/
  location VARCHAR(255),
  link VARCHAR(255)
);
CREATE TABLE teacher(
    staffid INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(255),
    profile_photo BLOB/*表示将头像图片存为2进制文件*/
);
CREATE TABLE course(
    courseid INT PRIMARY KEY,
    course_name VARCHAR(50),
    course_type VARCHAR(10),
    course_yaer INT,
    course_term INT,
    course_number VARCHAR(10)/*就是像COMP9900一样的课程编码*/
    /*因为我们可能要保存同一门课不同学期的内容，所以使用课程编号，年份，学期来分辨这些课程*/
);
CREATE TABLE quiz(
    quizid INT PRIMARY KEY,
    quizname VARCHAR(50),
    quiz_due DATETIME,
    quiz_trytime INT,/*表示可以尝试的次数，0为无限次*/
    quiz_file BLOB,
    answer_file VARCHAR(255),
    score INT,/*这个quiz包含的分数值*/
    courseid INT,/*弱实体*/
    FOREIGN KEY (courseid) REFERENCES course (courseid)
);
CREATE TABLE answer(
    studentid INT,
    quizid INT,
    mark INT,
    FOREIGN KEY (studentid) REFERENCES student (studentid),
    FOREIGN KEY (quizid) REFERENCES quiz (quizid)
    /*学生回答完问题后可以直接查看答案，因此不需要feedback*/
);
CREATE TABLE assignment(
    assignmentid INT PRIMARY KEY,
    score INT,/*这个ass包含的分数值*/
    quiz_due DATETIME,
    assignment_file BLOB,/*ASS题目，保存为pdf，这里是存文件还是存路径待定*/
    courseid INT,/*弱实体*/
    FOREIGN KEY (courseid) REFERENCES course(courseid)
);
CREATE TABLE wt_ass (/*write,触发关键字了，不能用*/
    studentid INT,
    assignmentid INT,
    answer_file VARCHAR(255),/*因为学生可能上传多种文件，这里存路径比较方便*/
    mark INT,
    feedback VARCHAR(255),
    FOREIGN KEY (studentid) REFERENCES student(studentid),
    FOREIGN KEY (assignmentid) REFERENCES assignment (assignmentid)
);
CREATE TABLE material(
    materialid INT PRIMARY KEY,
    material_type VARCHAR(255),/*按难度分类*/
    material_importance VARCHAR(255),/*按重要程度分类*/
    material_name VARCHAR(255),
    material_path VARCHAR(255),/*因为要展现出文件树的结构，因此存path比较方便*/
    courseid INT,/*弱实体*/
    FOREIGN KEY (courseid) REFERENCES course(courseid)
);
/*待建表有register,enroll
Forum相关
broadcast相关
*/