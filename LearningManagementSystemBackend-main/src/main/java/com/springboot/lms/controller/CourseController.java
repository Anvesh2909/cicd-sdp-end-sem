package com.springboot.lms.controller;

import com.springboot.lms.model.Course;
import com.springboot.lms.service.CourseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/course")
@CrossOrigin(origins = "http://localhost:5173/")
public class CourseController {

    @Autowired
    private CourseService courseService;

    Logger logger = LoggerFactory.getLogger("CourseController");


    @PostMapping("/add")
    public ResponseEntity<?> postCourse(@RequestBody Course course, Principal principal){
        String username = principal.getName();
        courseService.postCourse(course, username);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course Posted Successfully");
    }

    @GetMapping("/getById/{id}")
    public Course getCourseById(@PathVariable int id){

        return courseService.getCourseById(id);
    }

    @GetMapping("/getAll")
    public List<Course> getAllCourse(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page, @RequestParam(name = "size", required = false, defaultValue = "1000000") Integer size){
        if (page == 0 && size == 1000000)
            logger.info("No Pagination call for all courses");
        return courseService.getAllCourses(page, size);
    }

    @GetMapping("/getCoursesByAuthor")
    public List<Course> getCoursesByAuthor(Principal principal){
        return courseService.getCoursesByAuthor(principal.getName());
    }




}
