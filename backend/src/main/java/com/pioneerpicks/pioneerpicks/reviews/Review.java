package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import jakarta.persistence.*;

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

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Date date;

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

    public UUID getId() {
        return id;
    }

    public Professor getProfessor() {
        return professor;
    }

    public Course getCourse() {
        return course;
    }

    public String getName() {
        return name;
    }

    public Date getDate() {
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
