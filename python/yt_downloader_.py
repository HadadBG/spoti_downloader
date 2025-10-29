

import yt_dlp

import os


imagen=[]
import sys
import ffmpeg_normalize
import re
import zipfile


from yt_dlp.postprocessor import FFmpegPostProcessor
FFmpegPostProcessor._ffmpeg_location.set(r'C:\ffmpef\bin')


def download_video(url):
    ydl_opts = {
        'format': 'bestaudio/best',  # Descargar el mejor audio
        'outtmpl': './python/canciones/'+url.split("tsearch:")[1],  # Guardar como video.mp4
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',  # Extraer como MP3
            'preferredquality': '320',  # Calidad del audio
        }],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])




#lista=["jNY_wLukVW0"]    #["sElE_BfQ67s","7iVXEMyQnpA","50rlHVe6g9Q"] #"sElE_BfQ67s",
def get_songs(raw_string):
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
    if aux != "":
        songs_array.append(aux)
    return songs_array


#C:\Users\hbautistag\Desktop\spring\spotify\songs_list\SL_20250331_132428.txt
if __name__=="__main__":
    
    normalizer = ffmpeg_normalize.FFmpegNormalize(audio_codec="mp3",dynamic=True,sample_rate=48000,progress=True)
 
    
    with open (sys.argv[1],encoding="UTF-8")as file:
        raw_songs= file.readline()
        
    songs= get_songs(raw_songs)
    
    for index,song in enumerate(songs) :
        print("LOG:"+str(index+1)  )
        auxi = re.sub("[\\/:*?\"<>|]","#",song)
        download_video("ytsearch:"+auxi)
       
        normalizer.add_media_file("./python/canciones/"+auxi+".mp3","./python/normalizadas/"+auxi+".mp3")
    #print(f"LOG:Normalizando las {len(songs)} canciones")
    print("Normalizando canciones...")    
    normalizer.run_normalization()
    for file in os.listdir("./python/canciones/"):
        os.remove("./python/canciones/"+file)
    
    nombre=os.path.basename(sys.argv[1]).split(".")[0]  
    
    zip = zipfile.ZipFile("./songs_list/"+nombre+".zip", "w", zipfile.ZIP_STORED,compresslevel=1)
    for file in os.listdir("./python/normalizadas/"):
        zip.write("./python/normalizadas/"+file,arcname=file)
    zip.close()
    for file in os.listdir("./python/normalizadas/"):
        os.remove("./python/normalizadas/"+file)
 

