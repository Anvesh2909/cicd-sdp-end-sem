package com.springboot.lms.controller;

import com.springboot.lms.model.Course;
import com.springboot.lms.model.LModule;
import com.springboot.lms.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/module")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @PostMapping("/add/{courseId}")
    public ResponseEntity<?> addModule(@RequestBody LModule module, @PathVariable int courseId){
        moduleService.addModule(module, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Module Inserted Successfully");
    }

    @GetMapping("/getModulesByCourse")
    public List<LModule> getModulesByCourse(@RequestParam int courseId){
        return moduleService.getModulesByCourse(courseId);
    }


}
