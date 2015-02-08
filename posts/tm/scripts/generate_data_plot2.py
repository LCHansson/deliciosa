__author__ = 'luminitamoruz'

import json

def gender_artist(d):
    if len(d["gender"]) == 1:
        return d["gender"][0]

    f = len([x for x in d["gender"] if x == "F"])
    m = len([x for x in d["gender"] if x == "M"])
    if f > 0:
        if m > 0:
            return "B"
        else:
            return "F"
    elif m > 0:
        return "M"
    else:
        return "U"


def calculate_variables(data):
    # for each tm, get i) number of songs, ii) number and % of songs in final, iii) number  of winners
    # iv) number and % of bands, v) number and % of women, men and mixed vi) number of % for which it collaborated ,
    # vii) average number of love words, ix) average number of happy points

    res = []
    for tm in data:
        songs = tm["songs"]

        nsongs_final = len([s for s in songs if s['in_final']])
        nsongs_winning = len([s for s in songs if s['winner']])
        nbands =  len([s for s in songs if s['is_band']])

        nwomen =  len([s for s in songs if gender_artist(s) == 'F'])
        nmen =  len([s for s in songs if gender_artist(s) == 'M'])
        nmixt =  len([s for s in songs if gender_artist(s) == 'B'])
        N = nwomen + nmen + nmixt
        if N != len(songs):
            print "WARNING for ", tm["tm"], ": ", N, " != ", len(songs)

        ncollaborations = len([s for s in songs if s["tm_list"] > 1])

        songs_with_love_counts = [s for s in songs if s["love_count"] >= 0]
        avg_love_counts = sum([s["love_count"] for s in songs_with_love_counts])/float(len(songs_with_love_counts))

        songs_with_happy_score = [s for s in songs if s["happy_score"] != -10000]
        avg_happy_score= sum([s["happy_score"] for s in songs_with_happy_score])/float(len(songs_with_happy_score))

        if songs_with_love_counts != songs_with_happy_score:
            print "WARNING 2", tm


        d = {'tm_id': tm["tm_id"],
             'name': tm["tm"].encode('utf-8'),
             'number_songs': len(songs),
             'in_final_songs': nsongs_final,
             'in_final_songs_perc': float(nsongs_final)/len(songs)*100,
             'winning_songs': nsongs_winning,
             'winning_songs_perc': float(nsongs_winning)/len(songs)*100,
             'bands': nbands,
             'bands_perc': float(nbands)/len(songs)*100,
             'woman_artists': nwomen,
             'woman_artists_perc': float(nwomen)/N*100,
             'men_artists': nmen,
             'men_artists_perc': float(nmen)/N*100,
             'mixt_artists': nmixt,
             'mixt_artists_perc': float(nmixt)/N*100,
             #'in_collaboration': ncollaborations,
             #'in_collaboration_perc': float(ncollaborations)/len(songs)*100,
             'avg_love_counts': avg_love_counts,
             'avg_happy_score': avg_happy_score
        }
        res.append(d)

    return res

def print_data_per_var(data):

    keys = [d for d in data[0].keys() if d != "name"]
    keys.sort()
    for k in keys:
        print "----------------- ", k, "----------------------"
        data.sort(key=lambda d:d[k], reverse=True)
        for x in data:
            print "TM:", x["name"], ", Number of songs: ", x["number_songs"], ", ", k, ": ", x[k]

def write_data_to_json(data, filename):
    obj = open(filename, "w")
    json.dump(data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()

def write_data_table(tm_var_data, outf, variables=["name", "number_songs", "in_final_songs_perc",
                                                   "winning_songs_perc", "tm_id"]):
    # write a data table with the required variables in the given order
    data = []
    for tm in tm_var_data:
        l = [tm[v] for v in variables]
        data.append(l)
    dt = {"data": data}
    write_data_to_json(dt, outf)


if __name__ == '__main__':
    data = json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data-for-plots/tm_data_10_most_prolific.json"),
                         encoding="utf-8")
    # calculate all sort of interesting variables
    tm_var_data = calculate_variables(data)

    # print some stats to be able to choose the interesting variables
    print_data_per_var(tm_var_data)

    # write the data needed for the data table
    write_data_table(tm_var_data, outf="/Users/luminitamoruz/work/deliciosa/posts/tm/data-for-plots/tm_10_heroes.json")

    # TODO: generate staistics for all the song writers

    # TODO: write the jsons for the modal


    """
    obj = open("plot2_temp.json", "w")
    json.dump(tm_var_data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()
    """