package com.springboot.lms.dto;

import com.springboot.lms.model.Learner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class LearnerDto {

    private int id;
    private String name;
    private String username;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<LearnerDto> convertToDto(List<Learner> learners){
        List<LearnerDto> dtos = new ArrayList<>();

        for(Learner l: learners){
            LearnerDto dto = new LearnerDto();
            dto.setId(l.getId());
            dto.setName(l.getName());
            dto.setUsername(l.getUser().getUsername());
            dtos.add(dto);
        }

        return dtos;
    }
}
