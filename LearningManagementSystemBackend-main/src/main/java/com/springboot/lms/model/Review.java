package com.springboot.lms.model;

import jakarta.persistence.*;

@Entity
@Table (name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 1000)
    private String comments;
    private String rating;
    @ManyToOne
    private LearnerCourse learnerCourse;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public LearnerCourse getLearnerCourse() {
        return learnerCourse;
    }

    public void setLearnerCourse(LearnerCourse learnerCourse) {
        this.learnerCourse = learnerCourse;
    }
}
