package com.springboot.lms.service;

import com.springboot.lms.model.Course;
import com.springboot.lms.repository.LearnerCourseRepository;
import com.springboot.lms.repository.LearnerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
public class LearnerCourseServiceTest {

    @Autowired
    private LearnerCourseService learnerCourseService;



    @Test
    public void getCoursesOfGivenLearnerTest() {
        /*
        Actual
         */
        List<Course> courses = learnerCourseService.getCoursesOfGivenLearner(1);

        /*
        Expected:
         */

        Course course = new Course();
        course.setTitle("Java Programming");
        course.setId(1);
        course.setCredits(100);
        List<Course> expected = List.of(course);

        assertEquals(expected, courses);
    }


}