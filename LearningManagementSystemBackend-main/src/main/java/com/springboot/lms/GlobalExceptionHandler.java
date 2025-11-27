package com.springboot.lms;

import com.springboot.lms.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
     Logger logger = LoggerFactory.getLogger("GlobalExceptionHandler");
    /*
    This class is there to handle the all the exceptions, whenever a exception is thrown whether it is Runtime or any custom exception that we have defined this handler will help us throw the correct message instead of the status 501.
     */

    @ExceptionHandler(exception = RuntimeException.class)
    public ResponseEntity<?> handleRuntime(RuntimeException e) {
        Map<String, String> map = new HashMap<>();
        logger.error(e.getMessage(), e.getClass());
        map.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
    }

    @ExceptionHandler(exception = ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException e) {
        Map<String, String> map = new HashMap<>();
        logger.error(e.getMessage(), e.getClass());
        map.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
    }
    



}
