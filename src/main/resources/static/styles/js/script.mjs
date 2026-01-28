import { loadAsyncData } from "./modules/songs_table.mjs";

import {initialize_stomp } from "./modules/downloader_initializer.mjs"
const uuid = crypto.randomUUID();
$(document).ready(function () {
  
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    let step = 1;

    $("#btnSiguiente").click(function () {

        if (step === 1) {
            $("#paso1").fadeOut(200, function () {
                $("#paso2").fadeIn(250);
            });

            $("#btnAtras, #btnCerrar").fadeIn(150);
            $("#btnSiguiente").css("display","none")

            step = 2;
        }
    });

    $("#btnAtras").click(function () {

        if (step === 2) {
            $("#paso2").fadeOut(200, function () {
                $("#paso1").fadeIn(250);
            });

            $("#btnAtras, #btnCerrar").css("display","none");
            $("#btnSiguiente").fadeIn(150);

            step = 1;
        }

    });

});
$(document).on("click", ".copyBtn", function () {
    let texto = $(this).closest(".copyText").find(".textoCopiable").val();
    navigator.clipboard.writeText(texto);
    M.toast({html: 'Copiado!',
    displayLength:1500});
});


$( "#main" ).css( "display", "none" );
var  client_id = localStorage.getItem("client_id") == undefined ?null:localStorage.getItem("client_id")

if (!client_id || typeof client_id === "undefined" || client_id == "undefined"){
    client_id=null
}


$("#reload_all").on("click",()=>{
  
   $( "#reload_all>i" ).addClass("animate_rotation")
    localStorage.clear();
   console.log(client_id)
    if(client_id && client_id!= null ){
    try{
      let asyncRequest = new XMLHttpRequest();

     
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





var songs


if (spotidata != null  || client_id !=null){
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
async function prepareDownload(){
  let stompClient_all;
[client_id,songs] = await loadAsyncData()
 

     
$( "#download-one" ).on( "click", function() {
  let stompClient_one; 
   stompClient_one = new StompJs.Client({
    brokerURL: 'wss://'+ window.location.host+'/websocket?userId=' + uuid,
    //debug: (msg) => console.log('[STOMP]', msg),
    reconnectDelay: 5000,
    
  

});
initialize_stomp(stompClient_one,uuid,$("#toDownload").val(),1,1)
  
})


$( "#download-button" ).on( "click", function() {
 
 
  stompClient_all = new StompJs.Client({
    brokerURL: 'wss://'+ window.location.host+'/websocket?userId=' + client_id,
    //debug: (msg) => console.log('[STOMP]', msg),
    reconnectDelay: 5000,
    
  

});
let filtered_songs =  songs.map( x=>{
          let aux=   "\""+x.title +" - "+x.artists[0]
          if(x.artists.length != 1){
            aux += " feat "+x.artists[1]
          }
          return aux+"\""
       })

    let inicio=parseInt(document.getElementById("ini_songs").value)
  let final =parseInt(document.getElementById("end_songs").value)
console.log(songs.length)
  if(inicio > final || inicio<1 || isNaN(inicio)){
  let toastHTML = '<span>Inicio Invalido</span>';
  M.toast({html: toastHTML,
    displayLength:1500
  });
    return
  }
  else if(final > songs.length || isNaN(final)) {
     let toastHTML = '<span>Fin Invalido</span>';
      M.toast({html: toastHTML,
    displayLength:1500});
    return 

  }

initialize_stomp(stompClient_all,client_id,filtered_songs,inicio,final)  
   document.getElementById("download-button").style.display="none";
   
 console.log("publisshinngg..")
  



} );  

}
prepareDownload()

}

