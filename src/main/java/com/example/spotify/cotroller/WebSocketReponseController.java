package com.example.spotify.cotroller;



import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.ArrayList;


import org.springframework.beans.factory.annotation.Autowired;

//import java.security.Principal;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


import com.example.spotify.dto.WebSocketRequest;
import com.example.spotify.dto.WebSocketResponse;



@Controller
public class WebSocketReponseController {




    @Autowired
    private SimpMessagingTemplate messagingTemplate;



  @MessageMapping("/download_sl")
  public void download_songs(WebSocketRequest songsRequest,Principal principal,SimpMessageHeaderAccessor headerAccessor) throws Exception {
   // String topic = "/ws_messages/download_file";
    System.out.println("Conectado a web socket .... "+ principal.getName());
    int initialSong=songsRequest.getIniSong()-1;
    int finalSong =songsRequest.getEndSong();
    ArrayList<String> songs= songsRequest.getContent();
   String id_spo = principal.getName();
  System.out.println(initialSong);
  System.out.println(finalSong);
    songs=new ArrayList<String>(songs.subList(initialSong, finalSong));
  
    String id= "SL_"+id_spo+".zip";

    File file = new File("./songs_list/"+id);
    File file_txt = new File("./songs_list/"+id.replace("zip","txt"));
   if( !file_txt.exists() ){
    BufferedWriter writer = new BufferedWriter(new FileWriter(file_txt,StandardCharsets.UTF_8));
   
    writer.write(songs.toString());
    writer.close();
   }
 if( !file.exists() ) { 
    System.out.println("downloading..");
	String osName = System.getProperty("os.name");
	System.out.println(osName);
  ProcessBuilder builder;
    if (osName.contains("Windows")){
   builder= new ProcessBuilder(new String[] { "cmd.exe", "/c", "python \"./python/yt_downloader.py\" \"" + "./songs_list/"+id.replace("zip","txt") + "\""  });
    }
    else{
    builder = new ProcessBuilder(new String[] { "python","python/yt_downloader.py", "./songs_list/"+id.replace("zip","txt")  });
   

    }
        builder.redirectErrorStream(true);
   
        messagingTemplate.convertAndSendToUser(principal.getName(), "/ws_responses/sessionId",new WebSocketResponse("INI",Integer.toString(songs.size())));
          
        Process p = builder.start();
        
        BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
  
        String line;
        while ((line=r.readLine()) != null)
        {
          System.out.println(line);
          if(line.startsWith("LOG:")){
            line=line.replace("LOG:", "");
             messagingTemplate.convertAndSendToUser(principal.getName(), "/ws_responses/sessionId",new WebSocketResponse("DWNLD",line));
          }
          else if(line.startsWith("File:")){
           // System.out.println(line);
            String progreso=line.replaceAll(".*(\\d+)/\\d+.*", "$1");


            messagingTemplate.convertAndSendToUser(principal.getName(), "/ws_responses/sessionId",new WebSocketResponse("NRMLZ",progreso));
          
            System.out.println(progreso);
          }
          else{
          //  System.out.println(line);
          }
          
          
        }

        System.out.println("fin py");

}
   //String id_spo =songs.remove(0);
  
  //  songs=new ArrayList<String>(songs.subList(0, 25));
    //System.out.println(id_spo);
    
   messagingTemplate.convertAndSendToUser(principal.getName(), "/ws_responses/sessionId",new WebSocketResponse("END",""));
    
 
//    sessionService.sendToSession(sessionId,new WebSocketResponse("huennnass"));
 //   sessionService.sendToSession(sessionId,new WebSocketResponse("Hello, " + HtmlUtils.htmlEscape(message.getContent()) + "!"));
    

  }

}
