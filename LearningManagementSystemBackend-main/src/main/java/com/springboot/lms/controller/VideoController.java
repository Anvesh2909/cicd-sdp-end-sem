package com.springboot.lms.controller;

import com.springboot.lms.model.Video;
import com.springboot.lms.service.VideoService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/api/video/add/{moduleId}")
    public ResponseEntity<?> addVidoes(@RequestBody List<Video> videos, @PathVariable int moduleId){
        videoService.batchInsert(videos, moduleId);
        return ResponseEntity.status(HttpStatus.CREATED).body("ADDED SUCCESSFULLY");
    }

}
