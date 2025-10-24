package com.example.spotify.config;




import org.springframework.context.annotation.Configuration;

import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;

import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

import com.example.spotify.util.CustomHandshakeHandler;






@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  @Override
public void configureWebSocketTransport(@NonNull WebSocketTransportRegistration registration) {
    registration.setMessageSizeLimit(200 * 1024);         // Aumenta el límite de tamaño del mensaje (en bytes)
    registration.setSendBufferSizeLimit(512 * 1024);      // Aumenta el tamaño del búfer de envío
    registration.setSendTimeLimit(20 * 1000);             // Tiempo límite para enviar mensajes (en ms)
System.out.println("WebSocketTransport settings applied.");
  }

  @Override
  public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
    config.enableSimpleBroker("/ws_responses");
    config.setApplicationDestinationPrefixes("/ws_requests");
    config.setUserDestinationPrefix("/user");
  }

  @Override
  public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
  
    registry.addEndpoint("/websocket").setAllowedOrigins("*").setHandshakeHandler(new CustomHandshakeHandler());
  }

}