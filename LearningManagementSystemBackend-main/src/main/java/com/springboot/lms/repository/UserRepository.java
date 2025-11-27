package com.springboot.lms.repository;

import com.springboot.lms.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

   @Query("Select us from User us WHERE us.username = ?1")
   User getByUsername(String username);

}
