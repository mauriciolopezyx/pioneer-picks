package com.pioneerpicks.pioneerpicks.professors;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.reviews.Review;
import jakarta.persistence.*;

import java.util.*;

@Entity
@Table(name = "professors")
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "course_professors",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private final Set<Course> courses = new HashSet<>();

    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL)
    private final List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL)
    private final List<Review> reviews = new ArrayList<>();

    public Professor() {}

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<Course> getCourses() {
        return courses;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public List<Review> getReviews() {
        return reviews;
    }
}
