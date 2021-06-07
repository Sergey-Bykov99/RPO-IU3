package ru.iu3.rpo.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")

public class SampleController {

    @GetMapping("/title")
    public String getTitle() {
        return "<title>Hello from Backend</title>";
    }
}