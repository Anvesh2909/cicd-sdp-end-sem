package com.springboot.lms.service;

import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Learner;
import com.springboot.lms.model.User;
import com.springboot.lms.repository.LearnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerService {

    private final UserService userService;
    private LearnerRepository learnerRepository;

    public LearnerService(LearnerRepository learnerRepository, UserService userService){
        this.learnerRepository = learnerRepository;
        this.userService = userService;
    }

    public Learner insertLearner(Learner learner){
        User user = learner.getUser();
        user.setRole("LEARNER");

        user = userService.signUp(user);
        learner.setUser(user);

        return learnerRepository.save(learner);
    }

    public List<Learner> getAllLearners(){
        return learnerRepository.findAll();
    }

    public void deleteLearnerById(int id){
        learnerRepository.deleteById(id);
    }

    public Learner getLearnerByUsername(String username){
        Learner learner = learnerRepository.getByUsername(username);

        if(learner!=null){
            return learner;
        }
        else{
            throw new ResourceNotFoundException("Learner Not found");
        }
    }

    public Learner updateLearnerById(int id, Learner learner){
        Learner learnerToUpdate = learnerRepository.findById(id).orElseThrow(()->new RuntimeException("Learner Not found"));

        if(learner.getName() != null){
            learnerToUpdate.setName(learner.getName());
        }
        if(learner.getContact()!= null){
            learnerToUpdate.setContact(learner.getContact());
        }
        if(learner.getEmail() != null){
            learnerToUpdate.setContact(learner.getContact());
        }

        return learnerRepository.save(learnerToUpdate);

     }






}
