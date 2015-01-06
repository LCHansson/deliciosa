# -*- coding: utf-8 -*- 

import sys
import os
import json 

import jsoncomment 


def to_int(s):
    try:
        x = int(s.replace(" ", ""))
    except:
        print "WARNING at parsing ", s
        x = -1
    return x

def combine_partipants_results(participants_file, result_file, year):
    # extremely inefficient, little data, doesnt matter 
    part = json.load(open(participants_file))
    res = json.load(open(result_file))
    
    part_results = []
    in_final = 0
    for p in part:
        song = p['song']
        pr = {}

        pr['id'] = "{}_{}_{}".format(year, p['round'], p['startposition'])
        pr['artist'] = p['artist'].encode("utf-8")
        pr['artist_wikilink'] = p['artist_wikilink']
        pr['song_name'] = song
        pr['year'] = year
        pr['textmusic'] = p['textmusic'].encode("utf-8")
        pr['textmusic_wikilinks'] = p['textmusic_wikilinks']
        pr['prel_round_no'] = int(p['round'])
        pr['prel_start_position'] = int(p['startposition'])
        pr['prel_votes1'] = to_int(p['votes_round1'])
        pr['prel_votes2'] = to_int(p['votes_round2'])
        pr['prel_remark'] = p['remark'].encode("utf-8")
        pr['prel_placing'] = int(p['place'])

        pr['final_start_position'] = -1
        pr['final_jury_points'] = -1
        pr['final_tel_points'] = -1
        pr['final_placing'] = -1

        song = song.strip().lower()
        # find the result
        for r in res:
            if r['song'].strip().lower() == song:
                in_final += 1
                pr['final_start_position'] = int(r['startposition_final'])
                pr['final_jury_points'] = to_int(r['jury_points'])
                pr['final_tel_points'] = to_int(r['tel_points'])
                pr['final_placing'] = int(r['final_place'])

        pr['lyrics'] = u""
        pr['language'] = u""

        part_results.append(pr)

    print "INFO: year {}, {} got it to final".format(year, in_final)
    return part_results    

def clean_song_name(song_name):
    return song_name.strip().lower().replace(u"’", "").replace("'", "").replace("&", "and")

def add_lyrics_lumi(part_results, lyrics_file, year):
    parser = jsoncomment.JsonComment(json)
    s = open(lyrics_file).read()
    lyrics = parser.loads(s, encoding="utf-8")
    i = 0
    for l in lyrics:
        song = clean_song_name(l["song"])
        found = False
        for pr in part_results:
            if clean_song_name(pr['song_name']) == song:
                pr['lyrics'] = l['lyrics'].encode("utf-8")
                i += 1
                found = True
                break
        if not found:
            print "ERROR: year ", year, " song ",song, " lyrics not matched"

    print "INFO: for year {} {}/{} songs have lyrics available".format(year, i, len(part_results))
    return part_results

def add_lyrics_language(part_results, love_lyrics, year):
    i = 0
    for pr in part_results:
        song = clean_song_name(pr["song_name"])
        #print "Search:", song
        for ll in love_lyrics:
            ll_song = clean_song_name(ll["song"])
            if song == ll_song and int(ll["year"]) == year:
                i += 1
                if not pr["lyrics"] and ll["lyrics"] != "null":
                    pr["lyrics"] = ll["lyrics"].encode("utf-8")
                if pr["lyrics"] and ll["language"] and ll["language"] != "null":
                    pr["language"] = ll["language"]
    print "INFO: year ", year, i, "/", len(part_results), " songs found in Love's info"
    return part_results


def unify_data(dir_name, love_file):
   love_lyrics = json.load(open(love_file), encoding="utf-8")
   
   all_data = []
   for year in range(2002, 2015):
       participants_file = os.path.join(dir_name, "Melodifestivalen_{0}.json".format(year))
       result_file = os.path.join(dir_name, "Melodifestivalen_{0}_result.json".format(year))
       if os.path.isfile(participants_file) and os.path.isfile(result_file):
           part_results = combine_partipants_results(participants_file, result_file, year)
       else:
           print "Error for year {0}".format(year)

       # add lyrics 
       lyrics_file = os.path.join(dir_name, "Melodifestivalen_{0}_lyrics.json".format(year))    
       
       if os.path.isfile(lyrics_file):
          part_results = add_lyrics_lumi(part_results, lyrics_file, year)

       # add language and lyrics from love's data 
       part_results = add_lyrics_language(part_results, love_lyrics, year)   

       # song name is explicitly encoded as unicode   
       for pr in part_results:
           pr["song_name"] = pr["song_name"].encode("utf-8")
       all_data.append(part_results)   
   
   obj = open("/Users/luminitamoruz/work/deliciosa/python-scripts/data-manipulation/all_participants_data_2002_2014.json", "w") 
   json.dump(all_data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
   obj.close()

def main():
    unify_data(sys.argv[1], sys.argv[2])


if __name__ == '__main__':
    main()
