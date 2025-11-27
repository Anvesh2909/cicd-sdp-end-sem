package com.springboot.lms.service;

import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Course;
import com.springboot.lms.model.Learner;
import com.springboot.lms.model.LearnerCourse;
import com.springboot.lms.model.Review;
import com.springboot.lms.repository.CourseRepository;
import com.springboot.lms.repository.LearnerCourseRepository;
import com.springboot.lms.repository.LearnerRepository;
import com.springboot.lms.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private LearnerRepository learnerRepository;
    private CourseRepository courseRepository;
    private LearnerCourseRepository learnerCourseRepository;
    private ReviewRepository reviewRepository;

    public ReviewService(LearnerRepository learnerRepository, CourseRepository courseRepository, LearnerCourseRepository learnerCourseRepository, ReviewRepository reviewRepository) {
        this.learnerRepository = learnerRepository;
        this.courseRepository = courseRepository;
        this.learnerCourseRepository = learnerCourseRepository;
        this.reviewRepository = reviewRepository;
    }

    public Review postReview(int learnerId, int courseId, Review review) {
         /*
        1. Get the learner for the course
        2. Get the course in which the learner is enrolled
        3. The reason why learnerCourse is used to check whether the learner is enrolled in the course or not this way we can know that if not then we can throw the exception
        4. Get and set the learnerCourse object
        5. Set the learnerCourse object in review
        6. Call in the JPQL method and run the project to see the result
         */

        //LearnerCourse learnerCourse =  learnerCourseRepository.getUsingNativeSql(learnerId,courseId)
        //			.orElseThrow(()->new ResourceNotFoundException("Learner not enrolled in course"));

        //LearnerCourse learnerCourse =  learnerCourseRepository.getUsingNativeSql(learnerId,courseId)
        //			.orElseThrow(()->new ResourceNotFoundException("Learner not enrolled in course"));
        LearnerCourse learnerCourse =  learnerCourseRepository.getUsingJPQL(learnerId,courseId)
                .orElseThrow(()->new ResourceNotFoundException("Learner not enrolled in course"));

        // Attach LearnerCourse to review
        review.setLearnerCourse(learnerCourse);

        //Add review in DB
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByRatings(String rating){

        /*
        AIM: To fetch reviews that are greater than given ratings
        Params: RequestParam rating
        Solution: Use JPQL to fetch reviews that are greater than given rating using @Query annotation
         */

      return reviewRepository.getReviewsByRatings(rating);
    }

}
