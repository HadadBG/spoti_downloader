from time import sleep
import zipfile

sleep(2)
print("LOG:1",flush=True)
sleep(2)
print("LOG:2",flush=True)
sleep(2)
print("LOG:3",flush=True)
sleep(2)
print("LOG:4",flush=True)
sleep(2)
print("LOG:5",flush=True)
sleep(2)


print(f"Normalizando las 10 canciones",flush=True)
print("File: 100%|##########| 0/5 [00:30<00:00, 30.89s/it]",flush=True)    
sleep(2)
print("File: 100%|##########| 1/5 [00:30<00:00, 30.89s/it]",flush=True)
sleep(2) 
print("File: 100%|##########| 2/5 [00:30<00:00, 30.89s/it]",flush=True)    
sleep(2)
print("File: 100%|##########| 3/5 [00:30<00:00, 30.89s/it]",flush=True)    
sleep(2)   
print("File: 100%|##########| 4/5 [00:30<00:00, 30.89s/it]",flush=True)    
sleep(2)
print("File: 100%|##########| 5/5 [00:30<00:00, 30.89s/it]",flush=True)    
sleep(2)
print("File: 100%|##########| 5/5 [00:30<00:00, 30.89s/it]",flush=True)    
sleep(2)
with open("./algo.txt", "w") as fo:
    fo.write("Saludos\n")
zip = zipfile.ZipFile("./songs_list/"+"SL_12152632544"+".zip", "w", zipfile.ZIP_STORED,compresslevel=1)

zip.write("./algo.txt")
zip.close()
