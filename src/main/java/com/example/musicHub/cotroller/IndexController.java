package com.example.musicHub.cotroller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.musicHub.util.WriterThread;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;

import java.io.IOException;

import java.io.UnsupportedEncodingException;
//import java.net.InetSocketAddress;
//import java.net.Proxy;
//import java.net.Proxy.Type;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;

@Controller

public class IndexController {
  
  static File fileToBePiped;


  public static void setFileToBePiped(File fileToBePiped) {
    IndexController.fileToBePiped = fileToBePiped;
  }
  private byte[] sha256 (String entrada) throws NoSuchAlgorithmException{
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    ByteBuffer buf =StandardCharsets.UTF_8.encode(entrada);
    byte[] arr = new byte[buf.remaining()];
    buf.get(arr);
    
    return digest.digest(arr);

  }
  private String base64encode (byte[] bites){

    return new String( Base64.getEncoder().encode(bites),StandardCharsets.UTF_8)
    .replace("=", "").replace("+", "-").replace("/", "_");
  }
 
  // A GET request to the 'welcome' endpoint
private String generateRandomString(int len){
    SecureRandom random = new SecureRandom();
    final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    int n = chars.length();

    StringBuilder sb = new StringBuilder(len);
    byte[] buffer = new byte[len];

    random.nextBytes(buffer);

    for (int i = 0; i < len; i++) {
        int v = buffer[i] & 0xFF;
        sb.append(chars.charAt(v % n));
    }
    return sb.toString();
}
  private final String codeVerifier= generateRandomString(64);
  @GetMapping("/")
  public String IndexGET(Model model,@RequestParam(required = false) String code,HttpServletRequest request) throws NoSuchAlgorithmException, UnsupportedEncodingException {
    //SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
    String host = request.getHeader("Host");
   // Proxy proxy = new Proxy(Type.HTTP, new InetSocketAddress("172.20.112.254", 9090));
    //requestFactory.setProxy(proxy);
    byte[] hashed = sha256(codeVerifier);
    String codeChallenge = base64encode(hashed);
   String scheme = request.getScheme();
   host=scheme+"://"+host;
  System.out.println(host);
    String clientID ="59feae1e67864f53a889cdf5adf4191e";
    String redirectUri = host;
    String scope = "user-read-private user-read-email playlist-read-private user-library-read";
    String authUrl ="https://accounts.spotify.com/authorize";
    String url =UriComponentsBuilder.fromUriString(authUrl)
    .queryParam("response_type", "code")
    .queryParam("client_id",clientID)
    .queryParam("scope",  URLEncoder.encode(scope,"UTF-8"))
    .queryParam("code_challenge_method", "S256")
    .queryParam("code_challenge", codeChallenge)
    .queryParam("redirect_uri", URLEncoder.encode(redirectUri,"UTF-8"))
    .build().toString();
   
   
    if (code != null && code != "" ){

      
      
 HashMap<String,String> data = new HashMap<String,String>();
        data.put("client_id", clientID);
        data.put("grant_type", "authorization_code");
        data.put("code", code);
        data.put("redirect_uri",  redirectUri);
        data.put("code_verifier", codeVerifier);


        model.addAttribute("spotiMap",data );
        
    }
    model.addAttribute("spotifyUri", url);
    return "indexi";
  }
  @PostMapping("/download_songs")
  //firt posssiton of array is the spotify id
  public ResponseEntity<Object> Download_Songs(@RequestBody String id_request, HttpServletResponse response) throws IOException, InterruptedException {
   
    String id_spo =id_request.replace("\"", "");
  
   
    
    
    
  
    String id= "SL_"+id_spo+".zip";

    File file = new File("./songs_list/"+id);
   System.out.println("id:"+id);
 if( !file.exists() ) { 
   return new ResponseEntity<>(HttpStatus.FORBIDDEN);
}



fileToBePiped = file;
ServletOutputStream pos = response.getOutputStream();
System.out.println("Iniciando....");
response.setContentType("text/plain");
response.addHeader("Content-Disposition", "attachment;filename=" +id );
WriterThread thread = new WriterThread(file,pos);
  
  thread.start();
  thread.join();
 
  System.out.println("Finalizado");
  return null;

  }
   @PostMapping("/clear_data")
  //firt posssiton of array is the spotify id
  public void Clear_Data(@RequestBody String id_spo, HttpServletResponse response) throws IOException, InterruptedException {
  
    String id= "SL_"+id_spo+".txt";
    File file = new File("./songs_list/"+id);
    if( file.exists() ) {
      file.delete();
    }
    file = new File("./songs_list/"+id.replace("txt","zip"));
    if( file.exists() ) { 
      file.delete(); 
       }

  }

 

}
