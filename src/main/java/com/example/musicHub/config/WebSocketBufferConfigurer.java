package com.example.musicHub.config;

import jakarta.servlet.ServletContext;
import jakarta.websocket.server.ServerContainer;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class WebSocketBufferConfigurer {

    private final ServletContext servletContext;

    public WebSocketBufferConfigurer(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @EventListener
    public void onApplicationReady(ContextRefreshedEvent event) {
        ServerContainer serverContainer = (ServerContainer)
                servletContext.getAttribute("jakarta.websocket.server.ServerContainer");

        if (serverContainer != null) {
            serverContainer.setDefaultMaxTextMessageBufferSize(512 * 1024);  // 512 KB
            serverContainer.setDefaultMaxBinaryMessageBufferSize(512 * 1024);
            System.out.println("✅ WebSocket buffer sizes updated on ContextRefreshedEvent");
        } else {
            System.err.println("❌ ServerContainer is null on ContextRefreshedEvent");
        }
    }
}
