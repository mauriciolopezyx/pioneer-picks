package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "professor_id", referencedColumnName = "id")
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String semester;

    @Column(nullable = false)
    private Integer location;

    @Column(nullable = false)
    private Integer workload;

    @Column(nullable = false)
    private Integer leniency;

    @Column(nullable = false)
    private Integer communication;

    @Column(nullable = false)
    private Integer assignments;

    @Column(nullable = false)
    private Boolean curve;

    @Column(nullable = false)
    private Boolean attendance;

    @Column(nullable = false)
    private Boolean late;

    @Column(nullable = true)
    private String textbook;

    @Column(nullable = false)
    private String positive;

    @Column(nullable = false)
    private String negative;

    public Review() {}

    public Review(Professor professor, Course course, User user, LocalDate date, String semester, Integer location, Integer workload, Integer leniency, Integer communication, Integer assignments, Boolean curve, Boolean attendance, Boolean late, String positive, String negative) {
        this.professor = professor;
        this.course = course;
        this.user = user;
        this.date = date;
        this.semester = semester;
        this.location = location;
        this.workload = workload;
        this.leniency = leniency;
        this.communication = communication;
        this.assignments = assignments;
        this.curve = curve;
        this.attendance = attendance;
        this.late = late;
        this.positive = positive;
        this.negative = negative;
    }

    public Review(Professor professor, Course course, User user, LocalDate date, String semester, Integer location, Integer workload, Integer leniency, Integer communication, Integer assignments, Boolean curve, Boolean attendance, Boolean late, String textbook, String positive, String negative) {
        this.professor = professor;
        this.course = course;
        this.user = user;
        this.date = date;
        this.semester = semester;
        this.location = location;
        this.workload = workload;
        this.leniency = leniency;
        this.communication = communication;
        this.assignments = assignments;
        this.curve = curve;
        this.attendance = attendance;
        this.late = late;
        this.textbook = textbook;
        this.positive = positive;
        this.negative = negative;
    }

    public UUID getId() {
        return id;
    }

    public Professor getProfessor() {
        return professor;
    }

    public Course getCourse() {
        return course;
    }

    public User getUser() {
        return user;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getSemester() {
        return semester;
    }

    public Integer getLocation() {
        return location;
    }

    public Integer getWorkload() {
        return workload;
    }

    public Integer getLeniency() {
        return leniency;
    }

    public Integer getCommunication() {
        return communication;
    }

    public Integer getAssignments() {
        return assignments;
    }

    public Boolean getCurve() {
        return curve;
    }

    public Boolean getAttendance() {
        return attendance;
    }

    public Boolean getLate() {
        return late;
    }

    public String getTextbook() {
        return textbook;
    }

    public String getPositive() {
        return positive;
    }

    public String getNegative() {
        return negative;
    }

}
