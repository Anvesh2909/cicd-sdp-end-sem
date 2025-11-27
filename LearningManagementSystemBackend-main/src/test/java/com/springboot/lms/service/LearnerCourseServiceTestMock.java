package com.springboot.lms.service;

import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Course;
import com.springboot.lms.model.Learner;
import com.springboot.lms.model.LearnerCourse;
import com.springboot.lms.repository.CourseRepository;
import com.springboot.lms.repository.LearnerCourseRepository;
import com.springboot.lms.repository.LearnerRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@SpringBootTest
public class LearnerCourseServiceTestMock {
    @InjectMocks
    private LearnerCourseService learnerCourseService;
    @Mock
    private LearnerRepository learnerRepository;
    @Mock
    private LearnerCourseRepository learnerCourseRepository;
    @Mock
    private CourseRepository courseRepository;
    private Learner learner;
    private Course course;
    private LearnerCourse learnerCourse;

    @BeforeEach
    public void init(){

        learner = new Learner();
        learner.setId(1);
        learner.setName("Pokemon");
        learner.setEmail("poke@gmail.com");
        learner.setContact("contact");
        System.out.println("Learner Created At: " + learner);

        course = new Course();
        course.setTitle("Java Programming");
        course.setId(1);
        course.setCredits(100);
        System.out.println("Course Created At: " + course);

        learnerCourse = new LearnerCourse();
        learnerCourse.setId(25);
        learnerCourse.setLearner(learner);
        learnerCourse.setCourse(course);
        learnerCourse.setCouponCode("ABC");
        learnerCourse.setEnrollDate(LocalDate.now());

        System.out.println("LearnerCourse Created At: " + learnerCourse);
    }


    @Test
    public void getCoursesByLearnerIdTestMock(){
        List<Course> expected = List.of(course);
        when(learnerRepository.findById(1)).thenReturn(Optional.of(learner));
        when(learnerCourseRepository.getCoursesOfGivenLearner(1)).thenReturn(expected);
        List<Course> actual = learnerCourseService.getCoursesOfGivenLearner(1);
        assertEquals(expected, actual);
    }

    @Test
    public void enrollToCourseTest(){
        LearnerCourse lc = new LearnerCourse();

        when(learnerRepository.findById(1)).thenReturn(Optional.of(learner));
        when(courseRepository.findById(1)).thenReturn(Optional.of(course));
        when(learnerCourseRepository.save(lc)).thenReturn(learnerCourse);

        assertEquals(learnerCourse, learnerCourseService.enrollLearnerInCourse(1, 1, lc));

        ResourceNotFoundException e = assertThrows(ResourceNotFoundException.class, ()->{
           learnerCourseService.enrollLearnerInCourse(5, 1, lc);
        });
        assertEquals("Learner Not found", e.getMessage());

        e = assertThrows(ResourceNotFoundException.class, ()->{
            learnerCourseService.enrollLearnerInCourse(1, 5, lc);
        });
        assertEquals("Course Not found", e.getMessage());
    }


    @AfterEach
    public void nullify(){
        learner = null;
        System.out.println("Learner object released.." + learner);
        course = null;
        System.out.println("Course object released.." + course);
        learnerCourse = null;
        System.out.println("Learner object released.." +learnerCourse);
    }

}
