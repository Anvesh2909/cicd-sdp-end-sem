package com.springboot.lms.repository;

import com.springboot.lms.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {


    /*
    For JPQL unlike the normal SQL we pass in the instance variables in the query instead of the column name.
     */
    @Query("select r from Review r where r.rating > ?1")
    List<Review> getReviewsByRatings(String ratings);


}
