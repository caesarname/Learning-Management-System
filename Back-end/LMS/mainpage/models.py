from django.db import models

class Student(models.Model):
    studentid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    medal = models.CharField(max_length=255)
    profile_photo = models.BinaryField()

class Class(models.Model):
    classid = models.IntegerField(primary_key=True)
    class_time = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    link = models.CharField(max_length=255)

class Teacher(models.Model):
    staffid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    profile_photo = models.BinaryField()

class Course(models.Model):
    courseid = models.IntegerField(primary_key=True)
    course_name = models.CharField(max_length=50)
    course_type = models.CharField(max_length=10)
    course_year = models.IntegerField()
    course_term = models.IntegerField()
    course_number = models.CharField(max_length=10)

class Quiz(models.Model):
    quizid = models.IntegerField(primary_key=True)
    quizname = models.CharField(max_length=50)
    quiz_due = models.DateTimeField()
    quiz_trytime = models.IntegerField()
    quiz_file = models.BinaryField()
    answer_file = models.CharField(max_length=255)
    score = models.IntegerField()
    courseid = models.ForeignKey(Course, on_delete=models.CASCADE)

class Answer(models.Model):
    studentid = models.ForeignKey(Student, on_delete=models.CASCADE)
    quizid = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    mark = models.IntegerField()

class Assignment(models.Model):
    assignmentid = models.IntegerField(primary_key=True)
    score = models.IntegerField()
    quiz_due = models.DateTimeField()
    assignment_file = models.BinaryField()
    courseid = models.ForeignKey(Course, on_delete=models.CASCADE)

class Wt_Ass(models.Model):
    studentid = models.ForeignKey(Student, on_delete=models.CASCADE)
    assignmentid = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    answer_file = models.CharField(max_length=255)
    mark = models.IntegerField()
    feedback = models.CharField(max_length=255)

class Material(models.Model):
    materialid = models.IntegerField(primary_key=True)
    material_type = models.CharField(max_length=255)
    material_importance = models.CharField(max_length=255)
    material_name = models.CharField(max_length=255)
    material_path = models.CharField(max_length=255)
    courseid = models.ForeignKey(Course, on_delete=models.CASCADE)
# Create your models here.
