package com.springboot.lms.repository;

import com.springboot.lms.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {
    @Query("SELECT a FROM Author a WHERE a.user.username = :username")
    Author getByUsername(@Param("username") String username);

    Author findByUserId(Integer userId);
}
