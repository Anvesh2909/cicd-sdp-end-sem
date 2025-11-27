package com.springboot.lms.repository;

import com.springboot.lms.model.Course;
import com.springboot.lms.model.LModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<LModule, Integer> {


    List<LModule> course(Course course);

    @Query("select m from LModule m  where m.course.id = ?1")
    List<LModule> getModulesByCourse(int courseId);
}
