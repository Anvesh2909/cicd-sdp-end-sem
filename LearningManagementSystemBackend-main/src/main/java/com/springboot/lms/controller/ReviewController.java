package com.springboot.lms.controller;

import com.springboot.lms.model.LearnerCourse;
import com.springboot.lms.model.Review;
import com.springboot.lms.service.ReviewService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add/{learnerId}/{courseId}")
    public ResponseEntity<?> postReview(@PathVariable int learnerId, @PathVariable int courseId, @RequestBody Review review){
      return ResponseEntity.status(HttpStatus.OK).body(reviewService.postReview(learnerId, courseId, review));
    }

    @GetMapping("/getReviews")
    public List<Review> getReviewsByRatings(@RequestParam String rating){
        return reviewService.getReviewsByRatings(rating);
    }


}
