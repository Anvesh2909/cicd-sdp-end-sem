package com.springboot.lms.repository;

import com.springboot.lms.model.Course;
import com.springboot.lms.model.Learner;
import com.springboot.lms.model.LearnerCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerCourseRepository extends JpaRepository<LearnerCourse, Integer> {


    @Query("select lc from LearnerCourse lc where lc.learner.id= ?1 AND lc.course.id=?2")
    Optional<LearnerCourse> getUsingJPQL(int learnerId, int courseId);

    @Query("Select lc.learner from LearnerCourse lc where lc.course.id = ?1")
    List<Learner> getLearnerEnrolledInCourse(int courseId);

    @Query("Select lc.course from LearnerCourse lc where lc.learner.id = ?1")
    List<Course> getCoursesOfGivenLearner(int learnerId);

}
