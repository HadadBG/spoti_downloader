package com.example.musicHub.dto;

import java.util.ArrayList;

public class WebSocketRequest {

  private ArrayList<String> content;


  

  public WebSocketRequest(ArrayList<String> content,int iniSong,int endSong) {
    this.content = content;

  }

  public ArrayList<String> getContent() {
    return content;
  }

}