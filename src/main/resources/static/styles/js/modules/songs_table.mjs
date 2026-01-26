import { getAccessToken } from "./oauth.mjs";

function formate_Date(date){

    let  aux= new Date(date);
    let time = Math.round(Math.round(new Date()-aux)/1000) ;
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
async function  getAllSongs(access_token) {
 
  let all_songs=[]
  let offset=0
  while (true){
  let  body = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
  method: "GET",

  headers: {
    "Authorization": "Bearer "+access_token,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
       })
  let  json= await body.json()
       all_songs.push(...json.items)
       if ((offset+50) >=  json.total){
        break
       }
       offset+=50
  }
  
  return all_songs
}
 export async function  loadAsyncData() {
  let access_token,client_id
  let songs
//Spotidata - variable llenada dentro de index html proveniente de spring
   [client_id,access_token] =await getAccessToken(spotidata)
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
    songs =clean_data(await getAllSongs(access_token))
    console.log("canciones")
    console.log(songs)
    if (songs.length != 0){
   
    localStorage.setItem("songs",JSON.stringify(songs))
    }

}
 if (songs.length == 0){
 $( "#main_object" ).html(`
        <p style="margin-bottom: 1.5rem;"></p>
        <p>
                        Bienvenido ${spoti_name}<br/> al parecer no tienes<br/>
                          canciones
						<br />
					</p>
            <p style="margin-bottom: 2rem;"></p>
            <p>
					
						que te parece si agregas algunas a<br/>
            tus me gusta y vuelves.
            </p>
             <p style="margin-bottom: 2rem;"></p>
            `)
     $( "#footer_main" ).html(``)
     return
 }
      document.getElementById("end_songs").value = songs.length; 
    let less_songs=songs.slice(0,10)
    if(songs.length >=10){
      //Agregamos la ultima cancion para saber los indices
        less_songs.push(songs[songs.length - 1])
    }
       
      
     
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
      
let       songs_html = less_songs.join("")
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
					
						las canciones han sido recopiladas
            </p>
             <p style="margin-bottom: 2rem;"></p>
            `)
     $( "#footer_main" ).html(``)
  //console.log("|"+client_id+"|")

        return [client_id,songs]
}