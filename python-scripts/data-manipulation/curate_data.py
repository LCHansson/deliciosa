import sys 
import json
import re 


def clean_lyrics(formatted_data):
    def dotrepl(matchobj):
        if matchobj.group(0).find("..") != -1:
            return ""
        else:
            return  matchobj.group(0).replace(".", "")

    lyrics_re = re.compile("\.\.+")
    for entry in formatted_data:
        entry["lyrics_cleaned"] = re.sub("(\.\.+)|[a-zA-Z](\.)[a-zA-Z]", dotrepl, entry["lyrics"])
            
    return formatted_data


def add_language(language_json, data):
    language = json.load(open(language_json), encoding="utf-8")
    for l in language:
        found = False
        for entry in data:
            if entry["id"] == l["id"]:
                found = True
                entry["language"] = l["language"]
                break 
        if not found:
            print "WARNING: ", l,  " was not found"
    return data

def encode_data(data):
    for l in data:
        for k, v in l.iteritems():
            if type(v) == unicode:
                
                l[k] = v.encode("utf-8")
    return data

def add_nest_metadata(metadata_json, data):
    nest_metadata = json.load(open(metadata_json), encoding="utf-8")
    
    audio = ["energy", "liveness", "tempo", "speechiness", "acousticness", \
                 "instrumentalness", "mode", "time_signature", "duration", \
                 "loudness", "audio_md5", "valence", "danceability"]
    """
    "artist_location": {
                    "latitude": 57.7013,
                    "location": "Gothenburg, Vastra Gotaland, SE",
                    "longitude": 11.9669
                }

    """
    location = ["latitude", "longitude", "location"]
    for entry in data:
        for key in ["artist_id"] + audio + ["song_currency"] + location:
            entry["echonest_" + key] = -1000
        entry["echonest_artist_id"] = ""
        entry["echonest_location"] = ""
        entry["echonest_audio_md5"] = ""
        entry["echonest_song_type"] = []
        entry["echonest_release_image"] = ""

            
    for l in nest_metadata:
        found = False
        for entry in data:
            if entry["id"] == l["external_id"][0]:
                if len(l["songs"]) > 0: 
                    if "artist_id" in l["songs"][0]:
                        entry["echonest_artist_id"] = l["songs"][0]["artist_id"]
                    
                    if "audio_summary" in l["songs"][0]:
                        for k in audio:
                            if k in l["songs"][0]["audio_summary"]:
                                entry["echonest_" + k] = l["songs"][0]["audio_summary"][k]
                    
                    if "artist_location" in l["songs"][0]:
                         for k in location:
                            if k in l["songs"][0]["artist_location"]:
                                entry["echonest_" + k] = l["songs"][0]["artist_location"][k]

                    if "song_currency" in l["songs"][0]:
                        entry["echonest_song_currency"] = l["songs"][0]["song_currency"]

                    if "song_type" in l["songs"][0]:
                        entry["echonest_song_type"] = l["songs"][0]["song_type"]

                    if "tracks" in l["songs"][0] and len(l["songs"][0]["tracks"])>0:
                        if "release_image" in l["songs"][0]["tracks"][0]:
                            entry["echonest_release_image"] = l["songs"][0]["tracks"][0]["release_image"]

                found = True
                break 
        if not found:
            print "WARNING: ", l,  " was not found"

    return data
    
def main():
    filename = sys.argv[1]
    all_data = json.load(open(filename), encoding="utf-8")    

    formatted_data = []
    for year in all_data:
        for entry in year:
            formatted_data.append(entry)

    cleaned_lyrics_data = clean_lyrics(formatted_data)
    language = add_language(sys.argv[2], cleaned_lyrics_data)
    nest = add_nest_metadata(sys.argv[3], language)
    
    final_data = encode_data(nest)

    #print language
    obj = open("all_participants_all_data_2002_2014_2.json", "w") 
    json.dump(final_data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()



if __name__ == '__main__':
    main()

