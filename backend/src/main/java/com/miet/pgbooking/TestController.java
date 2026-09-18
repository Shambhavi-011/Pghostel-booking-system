package com.miet.pgbooking;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String checkApi() {
        return "Mera PG Booking Backend aur VS Code ekdum mast chal raha hai!";
    }
}