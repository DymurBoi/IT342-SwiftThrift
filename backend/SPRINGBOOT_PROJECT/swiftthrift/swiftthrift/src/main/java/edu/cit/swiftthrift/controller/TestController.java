package edu.cit.swiftthrift.controller;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
@SpringBootApplication
public class TestController {
    // Add imports
    // Add the controller.
    @RestController
    class HelloWorldController {
        @GetMapping("/test")
        public String hello() {
            return "hello world!";
        }
    }
}
