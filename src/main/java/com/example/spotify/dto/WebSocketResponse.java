package com.example.spotify.dto;



public class WebSocketResponse {

  private String msg;
  private String stat;
  public String getmsg() {
    return msg;
  }
  public WebSocketResponse(String stat,String msg) {
    this.msg = msg;
    this.stat = stat;
  }
  public String getstat() {
    return stat;
  }
  public void setmsg(String msg) {
    this.msg = msg;
  }
  public void setstat(String stat) {
    this.stat = stat;
  }
  



}