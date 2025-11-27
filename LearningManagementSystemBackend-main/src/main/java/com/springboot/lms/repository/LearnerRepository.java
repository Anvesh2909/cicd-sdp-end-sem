package com.springboot.lms.repository;

import com.springboot.lms.model.Learner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LearnerRepository extends JpaRepository<Learner, Integer> {

    @Query("Select l from Learner l WHERE l.user.username = ?1")
    public Learner getByUsername(String username);

}
