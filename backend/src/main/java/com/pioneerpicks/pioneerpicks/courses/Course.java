package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.reviews.Review;
import com.pioneerpicks.pioneerpicks.subjects.Subject;
import jakarta.persistence.*;

import java.util.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String abbreviation;

    @Column(nullable = false)
    private Integer units;

    @Column(nullable = true)
    private String areas;

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private Subject subject;

    @ManyToMany(mappedBy = "courses")
    private final Set<Professor> professors = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private final List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private final List<Review> reviews = new ArrayList<>();

    public Course() {}

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public Integer getUnits() {
        return units;
    }

    public String getAreas() {
        return areas;
    }

    public Subject getSubject() {
        return subject;
    }

    public Set<Professor> getProfessors() {
        return professors;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public List<Review> getReviews() {
        return reviews;
    }
}
