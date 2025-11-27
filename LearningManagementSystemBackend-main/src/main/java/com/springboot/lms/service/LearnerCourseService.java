package com.springboot.lms.service;

import com.springboot.lms.dto.LearnerDto;
import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Course;
import com.springboot.lms.model.Learner;
import com.springboot.lms.model.LearnerCourse;
import com.springboot.lms.repository.CourseRepository;
import com.springboot.lms.repository.LearnerCourseRepository;
import com.springboot.lms.repository.LearnerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LearnerCourseService {

    private LearnerRepository learnerRepository;
    private CourseRepository courseRepository;
    private LearnerCourseRepository learnerCourseRepository;
    private LearnerDto learnerDto;



    public LearnerCourseService(LearnerRepository learnerRepository, CourseRepository courseRepository,
                                LearnerCourseRepository learnerCourseRepository, LearnerDto learnerDto){
        this.learnerRepository = learnerRepository;
        this.courseRepository = courseRepository;
        this.learnerCourseRepository = learnerCourseRepository;
        this.learnerDto = learnerDto;
    }

    public LearnerCourse enrollLearnerInCourse(int learnerId, int courseId, LearnerCourse learnerCourse)
    {

        /*
        1. First fetch learner by using id
        2. Fetch COurse using id
        3. Set todays date as enroll date
        4. Set the course and learner to LearnerCourse
        5. Call the save method and save to database
         */
        Learner learner =  learnerRepository.findById(learnerId).orElseThrow(()->new ResourceNotFoundException("Learner Not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(()->new ResourceNotFoundException("Course Not found"));

        learnerCourse.setEnrollDate(LocalDate.now());
        learnerCourse.setCourse(course);
        learnerCourse.setLearner(learner);


        return learnerCourseRepository.save(learnerCourse);
    }

    public List<LearnerDto> getLearnerEnrolledInGivenCourse(int courseId){
        courseRepository.findById(courseId).orElseThrow(()->new ResourceNotFoundException("Course not found"));
//        return learnerCourseRepository.getLearnerEnrolledInCourse(courseId);
        /*
        This returns all the data of Course with user password and everything which is something we don't need
        To simplify this we have created a dto class in which only necessary details will be shown as a response
         */

        List<Learner> learners = learnerCourseRepository.getLearnerEnrolledInCourse(courseId);
        return learnerDto.convertToDto(learners);

    }

    public List<Course> getCoursesOfGivenLearner(int learnerId){

         /*
        AIM: Fetch all the courses of given learner
        Params: LearnerId taken as pathVariable
        Solution: Write a JPQL for fetching the courses of learner
         */
        learnerRepository.findById(learnerId).orElseThrow(()->new ResourceNotFoundException("Learner Not Found"));

        List<Course> courses = learnerCourseRepository.getCoursesOfGivenLearner(learnerId);

        if(courses!=null && courses.size() != 0)
        {
            return courses;
        }
        else{
            throw new ResourceNotFoundException("Learner not enrolled in any course");
        }

    }







}
