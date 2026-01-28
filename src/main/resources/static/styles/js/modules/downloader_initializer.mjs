export function initialize_stomp(stompClient,client_id,content_to_publish,inicio,final){
const div = document.getElementById("progress_section")
var just_one = false;
var cancion
const regex=/[\\/:*?\"<>|]/gi
if (final == inicio ){
  cancion=content_to_publish[0].substring(1,content_to_publish[0].length-1).replaceAll(regex,"#")
  if(!Array.isArray(content_to_publish)){
    cancion=content_to_publish
      const emptyArray = new Array();
      emptyArray.push('"'+content_to_publish+'"')
      content_to_publish=emptyArray;
      
      
  }
  just_one=true;

}

 
  if(div.style.display != "none" && div.style.display != ""){
     M.toast({html: 'No se pueden descargar mas de un archivo al mismo tiempo',
    displayLength:1500});
      return
  }
div.style.display="flex";
void div.offsetWidth;

  div.classList.add("visible")

stompClient.onStompError = (frame) => {
  console.error('Broker reported error: ' + frame.headers['message']);
  console.error('Additional details: ' + frame.body);
};
var titulo_download = document.getElementById("title_download")
var percent_download = document.getElementById("percent")
var bar_download = new ProgressBar.Path('#progress-path', {
  easing: 'easeInOut',
  duration: 1500
});
 var headerOffset = document.getElementById('header').offsetHeight;
    var elementPosition = div.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
    window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
var animation=0;
var increment =0;
var total_canciones
stompClient.onConnect = (frame) => {
    //console.log("Connected:", frame);

    // Suscribirte primero
    stompClient.subscribe("/user/ws_responses/sessionId", (message) => {
     
        let response =JSON.parse(message.body) 
        
        if (response.stat=="INI"){
          bar_download.set(0);
          console.log("BUENAAAAS")
          total_canciones = parseInt(response.msg,10)
          increment= (1/total_canciones)/2;
        
        }
        else if (response.stat=="DWNLD"){
          let aux = increment* parseInt(response.msg,10)
          titulo_download.innerHTML = `Descargando cancion numero ${response.msg} de ${total_canciones} ...`
          percent_download.innerHTML= `${Math.round(aux*100)}%`
          bar_download.animate(aux)

        }
        else if (response.stat == "NRMLZ"){
          if (response.msg == total_canciones.toString()){
            titulo_download.innerHTML = `Finalizando proceso ...`
            percent_download.innerHTML="100%"
            bar_download.animate(1)
          }
          else{
            let aux = (increment* (parseInt(response.msg,10)))+(increment*total_canciones)
            titulo_download.innerHTML = `Normalizando cancion numero ${parseInt(response.msg,10)+1} de ${total_canciones} ...`
            percent_download.innerHTML= `${Math.round(aux*100)}%`
           bar_download.animate(aux)

          }
        }
        else if(response.stat =="END"){
          document.getElementById("download-button").style.display="flex";
        const div = document.getElementById("progress_section")
        div.style.display="none";
        void div.offsetWidth;

        div.classList.add("visible")
        document.getElementById("main").scrollIntoView({ behavior: "smooth", block: "start" });
          try
    {
        let asyncRequest = new XMLHttpRequest();

        asyncRequest.open('POST', '/download_songs', true);    //   /Test is url to Servlet!
        asyncRequest.responseType="blob";
        asyncRequest.onload=()=>{
        
            if (asyncRequest.status == 200) 
      {
        
        const responseData = asyncRequest.response;
      
       
       var a = document.createElement("a"),
        url = URL.createObjectURL(responseData);
        a.href = url;
        if(just_one){
          a.download=cancion+".zip"
        }
        else{
         a.download = "SL_"+client_id+".zip";
        }
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },0);  
      console.log("Finisheeeed")
      }
        }
        asyncRequest.setRequestHeader("Content-Type", "application/json")
        console.log(client_id)
        if(just_one){
         
          
          
          console.log(cancion)
          asyncRequest.send(">"+cancion);
          
        
        }
        else{
          asyncRequest.send(JSON.stringify(client_id));
        }
    }
    catch(exception)
   {
    alert("Request failed");
    console.log(exception)
   }
        }
        // Luego puedes usar ese sessionId para otras suscripciones
    });

stompClient.publish({
    destination:"/ws_requests/download_sl",
    body:JSON.stringify({"content": content_to_publish, "iniSong":inicio,"endSong":final}),
  
  })
   
};
console.log("stomp iniciado...")
stompClient.activate()
}