package com.springboot.lms.controller;

import com.springboot.lms.model.Course;
import com.springboot.lms.model.LearnerCourse;
import com.springboot.lms.service.LearnerCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// ✅ Add this annotation to allow frontend (localhost:5173)
@CrossOrigin(origins = {"http://localhost:8083", "http://localhost:3000"})
@RestController
public class LearnerCourseController {

    @Autowired
    private LearnerCourseService learnerCourseService;

    // ✅ Keep this URL as-is — this is your correct backend path
    @PostMapping("/api/learner/enroll/course/{learnerId}/{courseId}")
    public ResponseEntity<?> enrollLearnerInCourse(
            @PathVariable int learnerId,
            @PathVariable int courseId,
            @RequestBody LearnerCourse learnerCourse) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(learnerCourseService.enrollLearnerInCourse(learnerId, courseId, learnerCourse));
    }

    @GetMapping("/api/learner/course/getLearner/{courseId}")
    public ResponseEntity<?> getLearnerEnrolledInCourse(@PathVariable int courseId) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .body(learnerCourseService.getLearnerEnrolledInGivenCourse(courseId));
    }

    @GetMapping("/api/learner/course/getCourses/{learnerId}")
    public List<Course> getCoursesOfGivenLearner(@PathVariable int learnerId) {
        return learnerCourseService.getCoursesOfGivenLearner(learnerId);
    }
}
