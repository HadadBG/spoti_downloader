$( "#main" ).css( "display", "none" );
let refresh_token=localStorage.getItem("refresh_token")

if (!refresh_token || typeof refresh_token === "undefined" || refresh_token == "undefined"){
    refresh_token=null
}


var client_id = localStorage.getItem("client_id") == undefined ?null:localStorage.getItem("client_id")
var access_token =null
var all_songs = []
var asyncRequest;
$("#reload_all").on("click",()=>{
   $( "#reload_all>i" ).addClass("animate_rotation")
    localStorage.clear();
   console.log(client_id)
    if(client_id && client_id!= null ){
    try{
      asyncRequest = new XMLHttpRequest();

     
        asyncRequest.open('POST', '/clear_data', true);    //   /Test is url to Servlet!
        
        asyncRequest.onload=(e)=>{
        console.log("status:"+asyncRequest.status)
            if (asyncRequest.status == 200) 
      {
        const responseData = asyncRequest.response;
        console.log(responseData)
       
     
       

      }
        }
        asyncRequest.setRequestHeader("Content-Type", "text/plain")
        asyncRequest.send(client_id);
    }
    catch(exception){
      console.log("Request Failed")
    }
   
  }
    window.location = window.location.href.split("?")[0];
});
function formate_Date(date){

    let  aux= new Date(date);
    let time = Math.round(new Date()-aux)/1000 ;
      if(time < 60){
        let cad = `hace ${time} segundo`
        if (time > 1){
          cad+="s"
        }
        return cad
      }
      time = Math.round(time/60)
      if (time < 60){
          let cad = `hace ${time} minuto`
        if (time > 1){
          cad+="s"
        }
        return cad
      }
       time = Math.round(time/60)
      if (time < 24){
         let cad = `hace ${time} hora`
        if (time > 1){
          cad+="s"
        }
        return cad
      }
       time = Math.round(time/24)
       if (time < 7){
         let cad = `hace ${time} día`
        if (time > 1){
          cad+="s"
        }
        return cad
      }
        time = Math.round(time/7)
       if (time < 5){
         let cad = `hace ${time} semana`
        if (time > 1){
          cad+="s"
        }
        return cad
      }
      
      let month_name = aux.toLocaleDateString("es-MX",{month:"long"})
      let year = aux.getFullYear()
      let day = aux.getDate()
      
      aux = [day.toString(),month_name.slice(0,3),year.toString() ].join(" ")
    return aux
}
function milis_to_minutes(milis){
   
    let seconds = Math.round(milis/1000)
    let minutes = Math.floor(seconds/60)
    seconds = seconds%60
    return minutes.toString()+":"+seconds.toString().padStart(2,"0")
}
function clean_data (songs){
  return songs.map( x=>{
    let obj  ={}
    obj.title=x.track.name
    obj.album=x.track.album.name
    obj.date=formate_Date(x.added_at)
    obj.duration=milis_to_minutes(x.track.duration_ms)
    obj.images=x.track.album.images
    obj.artists=x.track.artists.map(y=>{
      return y.name
    })
    return obj
  })
}
async function  getRefresh() {

  let body =   await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  body: new URLSearchParams(spotidata),
  headers: {
    "Content-type": "application/x-www-form-urlencoded"
  }
})
    let json = await body.json()
 
    
    localStorage.setItem("client_id",spotidata.client_id)
    localStorage.setItem("refresh_token",json.refresh_token)
    
    access_token = json.access_token
    console.log("refres:"+access_token)
    client_id = spotidata.client_id
    return
}

var stompClient;
async function getAccessToken(){
    if( refresh_token ==null){
    await getRefresh()
}
else{
    let body = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
    client_id

  }),
  headers: {
    "Content-type": "application/x-www-form-urlencoded"
  }
})

    let json = await body.json()
     localStorage.setItem("refresh_token",json.refresh_token)
 access_token = json.access_token
}

}
async function  getAllSongs() {
 
  all_songs=[]
  offset=0
  while (true){
    body = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
  method: "GET",

  headers: {
    "Authorization": "Bearer "+access_token,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
       })
       json= await body.json()
       all_songs.push(...json.items)
       if ((offset+50) >=  json.total){
        break
       }
       offset+=50
  }
  
  return all_songs
}
var songs
async function  loadAsyncData() {
    await getAccessToken()
    console.log(access_token)
      let body = await fetch("https://api.spotify.com/v1/me", {
  method: "GET",

  headers: {
    "Authorization": "Bearer "+access_token,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
       })
       let json= await body.json()

       let spoti_name = json.display_name
       client_id = json.id
   songs=JSON.parse(localStorage.getItem("songs"))

if (!songs || typeof songs === "undefined" || songs == "undefined"){
    songs =clean_data(await getAllSongs())
    console.log(songs)
    localStorage.setItem("songs",JSON.stringify(songs))

}
      document.getElementById("end_songs").value = songs.length; 
    let less_songs=songs.slice(0,10)
        less_songs.push(songs[songs.length - 1])
       
      
     
      less_songs=less_songs.map((x,index)=>{
         if (index ==10){
            index=songs.length-1
         }
        return `  
              <tr>
                  <td class="song-list_data number">${index+1}</td>
                  <td class="song-list_data title">
                    <img
                      src="${x.images[2].url}"
                    />
                    <div class="song-list_div">
                      <p>
                        ${x.title}
                      </p>
                      <p>${x.artists.join(", ")}</p>
                    </div>
                  </td>

                  <td class="song-list_data album">
                    <div>
                      ${x.album}
                    </div>
                  </td>
                  <td class="song-list_data date">${x.date}</td>

                  <td class="song-list_data duration">${x.duration}</td>
                </tr>
                `
      })
      
      songs_html = less_songs.join("")
      $("#songs-data").html(songs_html)
   
       $( "#main" ).css( "display", "block" );
       $( "#main_object" ).html(`
        <p style="margin-bottom: 1.5rem;"></p>
        <p>
                        Bienvenido<br/>
                        	${spoti_name}
						<br />
					</p>
            <p style="margin-bottom: 2rem;"></p>
            <p>
					
						las canciones han sido compiladas
            </p>
             <p style="margin-bottom: 2rem;"></p>
            `)
     $( "#footer_main" ).html(``)
  //console.log("|"+client_id+"|")
stompClient = new StompJs.Client({
    brokerURL: 'ws://'+ window.location.host+'/websocket?userId=' + client_id,
    //debug: (msg) => console.log('[STOMP]', msg),
    reconnectDelay: 5000,
    
  

});
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
var animation=0;
var increment =0;
var total_canciones
stompClient.onConnect = (frame) => {
    //console.log("Connected:", frame);

    // Suscribirte primero
    stompClient.subscribe("/user/ws_responses/sessionId", (message) => {
     
        response =JSON.parse(message.body) 
        
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
        asyncRequest = new XMLHttpRequest();

        //asyncRequest.addEventListener("readystatechange", stateChange, false);
        //asyncRequest.addEventListener("loadstart", handleEvent);
        asyncRequest.addEventListener("load", handleEvent);
        asyncRequest.addEventListener("loadend", handleEvent);
        
        asyncRequest.addEventListener("error", handleEvent);
        asyncRequest.addEventListener("abort", handleEvent);
        asyncRequest.open('POST', '/download_songs', true);    //   /Test is url to Servlet!
        asyncRequest.responseType="blob";
        asyncRequest.onload=(e)=>{
        
            if (asyncRequest.status == 200) 
      {
        
        const responseData = asyncRequest.response;
      
       
       var a = document.createElement("a"),
        url = URL.createObjectURL(responseData);
        a.href = url;
        a.download = "SL_"+client_id+".zip";
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
        asyncRequest.send(JSON.stringify(client_id));
    }
    catch(exception)
   {
    alert("Request failed");
   }
        }
        // Luego puedes usar ese sessionId para otras suscripciones
    });

   
};
stompClient.activate()
/*
stompClient.onConnect = (frame) =>{
console.log("status:"+ frame)

stompClient.subscribe("/user/ws_responses/sessionId",(message)=>{
    console.log("FromWsSession:"+message.body)
    console.log("Recibiendo....")
    /*sessionId = "buenas"
    console.log("subscribin to /ws_responses/sessions/"+client_id)
    stompClient.subscribe("/ws_responses/sessions/"+sessionId,(message)=>{
    console.log("FromWS:"+JSON.parse(message.body).content)
//})
})






}
*/

}

if (spotidata != null  || refresh_token !=null){
    $( "#main_object" ).html(`<p>
                        Descargando
						<br />
						Información de la cuenta y
						<br />
						Lista de Canciones.
					    </p>`)
     $( "#footer_main" ).html(`
        <div class="sk-folding-cube">
  <div class="sk-cube1 sk-cube"></div>
  <div class="sk-cube2 sk-cube"></div>
  <div class="sk-cube4 sk-cube"></div>
  <div class="sk-cube3 sk-cube"></div>
</div>
`)
loadAsyncData()

     }
function stateChange(){
  console.log("changginngg")
  console.log(asyncRequest.readyState)
if(asyncRequest.readyState == 4 && asyncRequest.status == 200)
    {


      console.log(asyncRequest)        //  div in HTML document
    }
}

function handleEvent(e) {
  console.log( `log:${e.type}`)
}

$( "#download-button" ).on( "click", function() {

  let inicio=parseInt(document.getElementById("ini_songs").value)
  let final =parseInt(document.getElementById("end_songs").value)
console.log(songs.length)
  console.log(inicio)
  if(inicio > final || inicio<1 || isNaN(inicio)){
  let toastHTML = '<span>Inicio Invalido</span>';
  M.toast({html: toastHTML});
    return
  }
  else if(final > songs.length || isNaN(final)) {
     let toastHTML = '<span>Fin Invalido</span>';
      M.toast({html: toastHTML});
    return 

  }
  let filtered_songs =  songs.map( x=>{
          let aux=   "\""+x.title +" - "+x.artists[0]
          if(x.artists.length != 1){
            aux += " feat "+x.artists[1]
          }
          return aux+"\""
       })
   document.getElementById("download-button").style.display="none";
   const div = document.getElementById("progress_section")
  div.style.display="block";
  void div.offsetWidth;

  div.classList.add("visible")
  div.scrollIntoView({ behavior: "smooth", block: "start" });
 
  stompClient.publish({
    destination:"/ws_requests/download_sl",
    body:JSON.stringify({"content": filtered_songs, "iniSong":inicio,"endSong":final}),
  
  })


  
} );  


