async function  getRefresh(spotidata) {
  //Spotidata is a variable filled by the backend
  let body =   await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  body: new URLSearchParams(spotidata),
  headers: {
    "Content-type": "application/x-www-form-urlencoded"
  }
})
    let json = await body.json()
    let access_token
    let client_id
    
    localStorage.setItem("client_id",spotidata.client_id)
    localStorage.setItem("refresh_token",json.refresh_token)
    
    access_token = json.access_token
   
    client_id = spotidata.client_id
    return [client_id,access_token]
}

export async function getAccessToken(spotidata){
  let refresh_token=localStorage.getItem("refresh_token")

if (!refresh_token || typeof refresh_token === "undefined" || refresh_token == "undefined"){
    refresh_token=null
}
    let client_id = localStorage.getItem("client_id") == undefined ?null:localStorage.getItem("client_id")
    let access_token;
    if( refresh_token ==null){
    [client_id,access_token]= await getRefresh(spotidata)
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
return [client_id,access_token]
}