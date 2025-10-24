package com.example.spotify.dto;

import java.util.ArrayList;

public class WebSocketRequest {

  private ArrayList<String> content;

  

  public WebSocketRequest(ArrayList<String> content) {
    this.content = content;
  }

  public ArrayList<String> getContent() {
    return content;
  }

}