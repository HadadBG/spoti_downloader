

import yt_dlp

import os


imagen=[]
import sys
import ffmpeg_normalize
import re
import zipfile


from yt_dlp.postprocessor import FFmpegPostProcessor
#FFmpegPostProcessor._ffmpeg_location.set(r'D:\programas\ffmpeg\bin')


def download_video(url):
    ydl_opts = {
        'cookiefile':'./python/youtube_cookies.txt',
        'format': 'bestaudio',  # Descargar el mejor audio
        'format-sort':'+size',
        'outtmpl': './python/canciones/'+url.split("tsearch:")[1],  # Guardar como video.mp4
      
    'remote_components':['ejs:github'],
    'js_runtimes': {'deno': {'path': None}, 'node': {'path': r'D:\programas\node\node-v20.15.1-win-x64\node.exe'}},
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',  # Extraer como MP3
            'preferredquality': '320',  # Calidad del audio
        }],
        'noplaylist':True
        

    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    if os.path.exists('./python/canciones/'+url.split("tsearch:")[1]+".mp3"):
        return
    print(url)
    print("no descargue nadota")
    nombre= url.split(":")[1]
    just_name= nombre.split("feat")[0]
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download(["ytsearch:"+just_name])




#lista=["jNY_wLukVW0"]    #["sElE_BfQ67s","7iVXEMyQnpA","50rlHVe6g9Q"] #"sElE_BfQ67s",
def get_songs(raw_string):
    print(raw_string)
    close_quote= False
    aux=""
    songs_array = []
    for character in raw_string[1:-1]:
        if character ==  '"': 
            close_quote = not close_quote
        elif close_quote:
            aux+=character
        elif character ==",":
            songs_array.append(aux)
            aux=""
    print(aux)
    if aux != "":
        songs_array.append(aux)
    print(songs_array)
    return songs_array


#C:\Users\hbautistag\Desktop\spring\spotify\songs_list\SL_20250331_132428.txt
if __name__=="__main__":
    
    normalizer = ffmpeg_normalize.FFmpegNormalize(audio_codec="mp3",dynamic=True,sample_rate=48000,progress=True)
    
    if ".txt" in sys.argv[1]:
        with open (sys.argv[1],encoding="UTF-8")as file:
            raw_songs= file.readline()
        
        songs= get_songs(raw_songs)
    else:
        songs=[sys.argv[1]]
    just_one = (len(songs) ==1)

    for index,song in enumerate(songs) :
        print("LOG:"+str(index+1)  )
        auxi = re.sub("[\\/:*?\"<>|]","#",song)
        download_video("ytsearch:"+auxi)
        if not just_one:
            normalizer.add_media_file("./python/canciones/"+auxi+".mp3","./python/normalizadas/"+auxi+".mp3")
    #print(f"LOG:Normalizando las {len(songs)} canciones")
    print("Normalizando canciones...")
    if not just_one:    
        normalizer.run_normalization()
    for file in os.listdir("./python/canciones/"):
        if just_one:
            os.rename("./python/canciones/"+file,"./python/normalizadas/"+file)
        else:       
            os.remove("./python/canciones/"+file)
    if just_one:
        nombre =re.sub("[\\/:*?\"<>|]","#",songs[0])
        
    else:
        nombre=os.path.basename(sys.argv[1]).split(".")[0] 
        
    zip = zipfile.ZipFile("./songs_list/"+nombre+".zip", "w", zipfile.ZIP_STORED,compresslevel=1)
    for file in os.listdir("./python/normalizadas/"):
        if ".git" in file:
            continue
        zip.write("./python/normalizadas/"+file,arcname=file)
    zip.close()
    for file in os.listdir("./python/normalizadas/"):
        os.remove("./python/normalizadas/"+file)
 

