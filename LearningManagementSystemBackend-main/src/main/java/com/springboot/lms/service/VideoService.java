package com.springboot.lms.service;

import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.LModule;
import com.springboot.lms.model.Video;
import com.springboot.lms.repository.ModuleRepository;
import com.springboot.lms.repository.VideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VideoService {
    private final ModuleRepository moduleRepository;
    private final VideoRepository videoRepository;

    public VideoService(ModuleRepository moduleRepository, VideoRepository videoRepository) {
        this.moduleRepository = moduleRepository;
        this.videoRepository = videoRepository;
    }

    @Transactional
    public void batchInsert(List<Video> videos, int moduleId) {

        LModule module = moduleRepository.findById(moduleId).orElseThrow(()->new ResourceNotFoundException("Module Id Invalid"));
        if(videos == null || videos.isEmpty()){
            throw new RuntimeException("Invalid Input null data for videos");
        }
        videos.parallelStream().forEach(v->v.setModule(module));
        videoRepository.saveAll(videos);
    }
}
