package com.springboot.lms.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "learner_course")
public class LearnerCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "coupon_code")
    private String couponCode;
    private LocalDate enrollDate;
    @ManyToOne
    private Course course;
    @ManyToOne
    private Learner learner;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public LocalDate getEnrollDate() {
        return enrollDate;
    }

    public void setEnrollDate(LocalDate enrollDate) {
        this.enrollDate = enrollDate;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Learner getLearner() {
        return learner;
    }

    public void setLearner(Learner learner) {
        this.learner = learner;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        LearnerCourse that = (LearnerCourse) o;
        return id == that.id && Objects.equals(couponCode, that.couponCode) && Objects.equals(enrollDate, that.enrollDate) && Objects.equals(course, that.course) && Objects.equals(learner, that.learner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, couponCode, enrollDate, course, learner);
    }
}
