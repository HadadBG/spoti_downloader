package com.example.musicHub.util;

import java.io.File;

import jakarta.servlet.ServletOutputStream;
import java.io.FileInputStream;
import java.io.IOException;


public class WriterThread extends Thread{
  File file;
  ServletOutputStream pos;
  public WriterThread(File file, ServletOutputStream pos){
    this.file=file;
    this.pos=pos;
  }
  
@Override
    public void run() {

        int BUFF_SIZE = 314572800;//300MB
                       
    byte[] buffer = new byte[BUFF_SIZE];
    int i=1;
       try {
           System.out.println(file.toPath());
           FileInputStream fis =new FileInputStream(file);
           int len_file=fis.available();
           int resultado=0;
           do{
                System.out.println(BUFF_SIZE*i);
                if (len_file <  BUFF_SIZE*i){
                    BUFF_SIZE=(len_file%(BUFF_SIZE*i));
                    buffer = new byte[BUFF_SIZE];
                    resultado=-1;
                }
   
              fis.read(buffer,0,BUFF_SIZE);
              pos.write(buffer);
                 
              i+=1;
           }
           while(resultado != -1);
           
          fis.close();
          pos.flush();
      pos.close();
       }
       catch (IOException ex) {
          ex.printStackTrace();
       }
       
  }
}