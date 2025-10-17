package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.courses.Course;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String abbreviation;

    @Column(nullable = false)
    private String description;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private final Set<Course> courses = new HashSet<>();

    public Subject() {}

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public String getDescription() {
        return description;
    }

    public Set<Course> getCourses() {
        return courses;
    }

}
