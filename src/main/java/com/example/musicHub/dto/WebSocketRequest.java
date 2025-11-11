package com.example.musicHub.dto;

import java.util.ArrayList;

public class WebSocketRequest {

  private ArrayList<String> content;
  private int iniSong;
  private int endSong;

  

  public WebSocketRequest(ArrayList<String> content,int iniSong,int endSong) {
    this.content = content;
    this.iniSong=iniSong;
    this.endSong=endSong;
  }

  public ArrayList<String> getContent() {
    return content;
  }

  public int getIniSong() {
    return iniSong;
  }
   public int getEndSong() {
    return endSong;
  }
}