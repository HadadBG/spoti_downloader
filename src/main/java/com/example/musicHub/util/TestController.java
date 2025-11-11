package com.example.musicHub.util;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final SimpMessagingTemplate messagingTemplate;

    public TestController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/send-test")
    public String sendTest() {
        messagingTemplate.convertAndSendToUser("9999999", "/ws_responses/sessionId", "Mensaje de prueba");
        return "Mensaje enviado";
    }
}