import json 
import os 
import sys

old_data = json.load(open("../data/texterna_lovecounts.json"))

# data need to the dataTable in week 1
"""
data = []
for d in old_data:
    r = [d["artist"].encode("utf-8"), d["song_name"].encode("utf-8"), d["year"], d["lovecount"], d["id"]]
    

    data.append(r)

ret = {"data": data}
 
obj = open("ttt.json", "w")
json.dump(ret, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
obj.close()
"""

# get the lyrics as separate json 
outfolder = "../data/lyrics/"
for d in old_data:
    s = d["song_name"].encode("utf-8")
    o = {"lyrics": d["lyrics_cleaned"].encode("utf-8"),
         "song_name": s[0].upper() + s[1:]}
    f = os.path.join(outfolder, d["id"] + "_lyrics.json")
    obj = open(f, "w")
    json.dump(o, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()
   
