__author__ = 'luminitamoruz'

import sys
import os
import json

def get_gender(name,  women_name, men_name):
    if name in women_name:
        return "F"
    if name in men_name:
        return "M"
    return "U"

def get_name_tm(tm_str):
    for ttt in ["(tm)", "(m)", "(t)"]:
        idx = tm_str.find(ttt)
        if idx != -1:
            return tm_str[0:idx].strip(), ttt
    print "WARNING for ", tm_str
    return tm_str, "unknown"



    return tm_str.replace("(tm)", "").replace()

def get_tm_firstnames(tm_string):
    first_names = []
    artist_names = []
    for tm in tm_string.split("&"):
        first_names.append(tm.split()[0])
        n, t = get_name_tm(tm)
        artist_names.append(n.encode("utf-8"))
        """
        if t in artist_names:
            artist_names[t].append(n)
        else:
            artist_names[t] = [n]
        """

    return first_names, artist_names

def get_gender_data(all_data, women_name, men_name):

    gender_data = {}
    i = 0
    k = 0
    m = 0
    mtm = 0
    for d in all_data:
        artist_gender = get_gender(d["artist"].split()[0], women_name, men_name)
        if artist_gender != "U":
            i += 1

        tm_firstnames, tm_list = get_tm_firstnames(d["textmusic"])
        k += len(tm_firstnames)
        tm_genders = []
        for tmf in tm_firstnames:
            tmg = get_gender(tmf, women_name, men_name)
            tm_genders.append(tmg)
            if tmg != "U":
                m += 1
                if tmg == "M":
                    mtm += 1

        gender_data[d["id"]] = {"artist": d["artist"].encode("utf-8"),
                                "tm": d["textmusic"].encode("utf-8"),
                                "tm_list": tm_list,
                                "artist_gender": [artist_gender],
                                "tm_genders": tm_genders}

        #for key, val in tm_dict.iteritems():
        #    gender_data[d["id"]][key] = val

    print "{}/{}={}% artists got a gender assigned".format(i, len(all_data), float(i)/len(all_data)*100)
    print "{}/{}={}% text and music got a gender assigned, {}/{}={}% are males".format(m, k, float(m)/k*100,
                                                                                       mtm, m, float(mtm)/m*100)

    return gender_data


if __name__ == '__main__':
    women_name = set([l.strip() for l in open("kvinno_namn.txt").readlines()])
    men_name = set([l.strip() for l in open("man_namn.txt").readlines()])
    all_data = json.load(open("../all_participants_all_data_2002_2014_2.json"), encoding="utf-8")

    gender_data = get_gender_data(all_data, women_name, men_name)
    obj = open("all_participants_data_2002_2014_gender_NOT_curated.json", "w")
    json.dump(gender_data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()

    for g, v in  gender_data.iteritems():
        print v




