package com.springboot.lms.service;

import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Author;
import com.springboot.lms.model.Course;
import com.springboot.lms.repository.AuthorRepository;
import com.springboot.lms.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    private final AuthorRepository authorRepository;
    private CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository, AuthorRepository authorRepository){
        this.courseRepository = courseRepository;
        this.authorRepository = authorRepository;
    }

    public void postCourse(Course course, String username){
        logger.info("Adding course for username: {}", username);
        Author author = authorRepository.getByUsername(username);
        if (author == null) {
            logger.error("Author not found for username: {}", username);
            throw new ResourceNotFoundException("Author not found for username: " + username);
        }
        logger.info("Found author: {} with ID: {}", author.getFullName(), author.getId());
        course.setAuthor(author);
        Course savedCourse = courseRepository.save(course);
        logger.info("Course saved with ID: {}", savedCourse.getId());
    }

    public Course getCourseById(int id){
        return courseRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Course not found for the given Id"));
    }

    public List<Course> getAllCourses(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return courseRepository.findAll(pageable).getContent();
    }

    public List<Course> getCoursesByAuthor(String username){
        logger.info("Fetching courses for username: {}", username);

        // First check if the author exists
        Author author = authorRepository.getByUsername(username);
        if (author == null) {
            logger.warn("Author not found for username: {}", username);
            return List.of(); // Return empty list instead of null
        }

        logger.info("Found author: {} with ID: {}, User: {}",
                author.getFullName(), author.getId(),
                author.getUser() != null ? author.getUser().getUsername() : "null");

        // Check total courses in database
        long totalCourses = courseRepository.count();
        logger.info("Total courses in database: {}", totalCourses);

        List<Course> courses = courseRepository.getByUsername(username);
        logger.info("Found {} courses for username: {}", courses.size(), username);

        // Log details of each course
        for (Course course : courses) {
            logger.info("Course: ID={}, Title={}, Author={}",
                    course.getId(), course.getTitle(),
                    course.getAuthor() != null && course.getAuthor().getUser() != null ?
                            course.getAuthor().getUser().getUsername() : "null");
        }

        return courses;
    }
}