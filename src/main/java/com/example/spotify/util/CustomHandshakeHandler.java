package com.example.spotify.util;



import org.springframework.http.server.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;



import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
        @NonNull ServerHttpRequest request,
                                      @NonNull WebSocketHandler wsHandler,
                                      @NonNull Map<String, Object> attributes) {
        // Obtenemos el ID del usuario desde el interceptor
      String uri = request.getURI().toString();
    
      String userId;
      if( uri.contains("userId=")){                                  
      userId = uri.split("userId=")[1];
      
        System.out.println("userID conectado :");
           System.out.println(userId);      
      }   
      else{
        userId="";
      }
        // Retornamos un principal con ese ID
        return () -> userId;
    }
} 
    

