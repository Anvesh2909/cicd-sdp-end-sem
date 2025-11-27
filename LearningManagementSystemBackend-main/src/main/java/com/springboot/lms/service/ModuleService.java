package com.springboot.lms.service;

import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Course;
import com.springboot.lms.model.LModule;
import com.springboot.lms.repository.CourseRepository;
import com.springboot.lms.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleService {

    private ModuleRepository moduleRepository;
    private CourseRepository courseRepository;

    public ModuleService(ModuleRepository moduleRepository, CourseRepository courseRepository){
        this.moduleRepository = moduleRepository;
        this.courseRepository = courseRepository;
    }


    public void addModule(LModule module, int courseId){
        Course course = courseRepository.findById(courseId).orElseThrow(()->new ResourceNotFoundException("Course Not Found"));
        module.setCourse(course);
        moduleRepository.save(module);
    }

    public List<LModule> getModulesByCourse(int courseId){
        return moduleRepository.getModulesByCourse(courseId);
    }

}
