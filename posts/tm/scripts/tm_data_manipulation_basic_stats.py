# -*- coding: utf-8 -*-
__author__ = 'luminitamoruz'

import json


########### PLOT 1
def get_artists_gender_balance(all_data, outf):
    """
    Divide in 3 groups
    """
    nfemale = 0
    nmale = 0
    nboth = 0
    single_artists = 0
    unassigned = 0
    for d in all_data.values():
        artist_genders = d["artist_gender"]
        # if only one gender and that is not unknown, then it is a single artist
        # otherwise we assume a band
        if len(artist_genders) == 1:
            if artist_genders[0] == 'U':
                unassigned += 1
            else:
                single_artists += 1

        # check female/male
        f = len([x for x in artist_genders if x == "F"])
        m = len([x for x in artist_genders if x == "M"])
        if f > 0:
            if m > 0:
                nboth += 1
            elif len(artist_genders) == f:
                nfemale += 1
            else:
                print "WARNING 1 FOR ", d, "\n"
        elif m > 0:
            if len(artist_genders) == m:
                nmale += 1
            else:
                print "WARNING 2 FOR ", d, "\n"


    t = nfemale + nmale + nboth
    a = len(all_data)-unassigned
    #print t, a
    print "\n--------- Artist stats: "
    print "Total songs: {}, Unassigned gender: {} = {}%".format(len(all_data), unassigned, float(unassigned)/len(all_data)*100)
    print "Total songs: {}, single artist: {} = {}%".format(len(all_data), single_artists,
                                                            float(single_artists)/len(all_data)*100)
    print "Total assigned: {}, male: {} = {}%, both: {} = {}%, female: {} = {}%".format(t,
                    nmale, float(nmale)/t*100, nboth, float(nboth)/t*100, nfemale, float(nfemale)/t*100)

    print "---------------------"
    data = [{'categ_name': 'Män', 'val': nmale},
            {'categ_name': 'Mix', 'val': nboth},
            {'categ_name': 'Kvinnor', 'val': nfemale}]
    obj = open(outf, "w")
    json.dump(data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()


def get_tm_gender_balance(all_data, outf):
    """
    Divide in 3 groups
    """
    nfemale = 0
    nmale = 0
    nboth = 0
    for d in all_data.values():
        f = len([x for x in d["tm_genders"] if x == "F"])
        m = len([x for x in d["tm_genders"] if x == "M"])
        if f > 0:
            if m > 0:
                nboth += 1
            elif len(d["tm_genders"]) == f:
                nfemale += 1
            else:
                print "WARNING 1 FOR ", d, "\n"
        elif m > 0:
            if len(d["tm_genders"]) == m:
                nmale += 1
            else:
                print "WARNING 2 FOR ", d, "\n"
        else:
                print "WARNING 3 FOR ", d, "\n"


    t = nfemale + nmale + nboth
    print "\n--------- Text music stats: "
    print "Total songs: {}, (Only) male: {} = {}%, (Only) female: {} = {}%, mixed: {} = {}%".format(
        len(all_data), nmale, float(nmale)/t*100, nfemale, float(nfemale)/t*100, nboth, float(nboth)/t*100)
    print "---------------------"
    data = [{'categ_name': 'Män', 'val': nmale},
            {'categ_name': 'Mix', 'val': nboth},
            {'categ_name': 'Kvinnor', 'val': nfemale}]
    obj = open(outf, "w")
    json.dump(data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()


# def get_tm_gender_balance(all_data):
#     """
#     Calculate the genders giving proportional weight to  men and women
#     """
#     female = 0
#     male = 0
#     nassigned = 0
#     for d in all_data.values():
#         f = len([x for x in d["tm_genders"] if x == "F"])
#         m = len([x for x in d["tm_genders"] if x == "M"])
#         female += float(f) / (f+m)
#         male += float(m) / (f+m)
#         if f > 0 or m > 0:
#             nassigned += 1
#         else:
#             print "WARNING: Unassigned tm genders for {}".format(d)
#
#     print "--------- Text music stats: "
#     print "Total: {}, Assigned at least one gender: {}, female: {}%, male: {}%".format(len(all_data),
#             nassigned, float(female)/(nassigned)*100, float(male)/nassigned*100)
#     print "---------------------"
#
#
# def get_tm_gender_unique(all_data):
#     """
#     Calculate % of unique song writers
#     """
#     female = []
#     male = []
#     for d in all_data.values():
#         for x, y in zip(d["tm_genders"], d["tm_list"]):
#             if x == "F":
#                 female.append(y)
#             elif x == "M":
#                 male.append(y)
#
#     uf = len(set(female))
#     um = len(set(male))
#     print "--------- Text music stats (unique song writers): "
#     print "Total males: {}, Unique males: {}".format(len(male), um)
#     print "Total females: {}, Unique females: {}".format(len(female), uf)
#     print "Unique females: {}%, Unique males: {}%".format(float(uf)/(uf+um)*100, float(um)/(uf+um)*100)
#     print "---------------------"


####### PLOT 2
def get_tm_frequency(all_data, n=10):

    freqs = {}
    for k, d in all_data.iteritems():
        for tm in d["tm_list"]:
            if tm in freqs:
                freqs[tm].append(k)
            else:
                freqs[tm] = [k]

    all_tms = freqs.items()
    all_tms.sort(key = lambda p: len(p[1]), reverse=True)

    #for tm, v in all_tms[0:572]:
    #    print tm, sorted(v)

    unique = []
    for tm, v in all_tms[0:n]:
        unique += v
    unique = set(unique)

    print "\n--------- Text music: proflific participants"
    tm_perc = float(n)/len(all_tms)*100
    unique_perc = float(len(unique))/len(all_data)*100
    print "First {}/{} = {}% of all the text writers have been involved in {}({}%) of songs".format(n, len(all_tms),
                                                                                                    tm_perc, len(unique),
                                                                                                    unique_perc)
    print "---------------------"


def get_tm_centric_data(all_data, all_participants_data, texts_data, outf, n=None):
    # get the songs writen by each song writer
    freqs = {}
    for k, d in all_data.iteritems():
        # is this a band?
        is_band = True
        if len(d["artist_gender"]) == 1:
            is_band = False

        # did these people got to final?
        in_final = False
        are_winners = False
        if all_participants_data[k]["final_start_position"] != -1:
            in_final = True
            if all_participants_data[k]["final_placing"] == 1:
                are_winners = True

        # get love points and happiness, -10000 if not found
        if not k in texts_data:
            love_count = -10000
            happy_score = -10000
        else:
            love_count = texts_data[k]['love']
            happy_score = texts_data[k]['happy']

        # year
        nd = {'song_id': k,
              'song_name': all_participants_data[k]["song_name"].encode('utf-8'),
              'artist': d["artist"].encode('utf-8'),
              'gender': d["artist_gender"],
              'tm_list': [x.encode('utf-8') for x in d["tm_list"]],
              'tm_genders': d["tm_genders"],
              'is_band': is_band,
              'year': all_participants_data[k]["year"],
              'in_final': in_final,
              'winner': are_winners,
              "final_jury_points": all_participants_data[k]["final_jury_points"],
              "final_placing": all_participants_data[k]["final_placing"],
              "final_tel_points": all_participants_data[k]["final_tel_points"],
              'love_count': love_count,
              'happy_score': happy_score
              }
        for tm in d["tm_list"]:
            if tm in freqs:
                freqs[tm].append(nd)
            else:
                freqs[tm] = [nd]

    data = freqs.items()
    data.sort(key=lambda p: len(p[1]), reverse=True)
    if n:
        data = data[0:n]
    ret = []
    for tm, song_list in data:
        song_list.sort(key=lambda s: s["year"])
        ret.append({'tm_id': "tm_" + song_list[0]["song_id"],
                    'tm': tm.encode('utf-8'),
                    'songs': song_list})

    obj = open(outf, "w")
    json.dump(ret, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()


def get_dict(data, key="id"):
    d = {}
    for dd in data:
        d[dd[key]] = dd
    return d

def print_dict(d):
    for k, v in d.iteritems():
        print k, v

def get_texterna_dict(data):
    d = {}
    for l in data:
        d[l[3]] = {'love': l[1], 'happy': l[2]}
    return d


if __name__ == '__main__':
    all_data = json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data/all_participants_data_2002_2014_gender_curated.json"), encoding="utf-8")

    # plot 1
    get_tm_gender_balance(all_data, outf="data-for-plots/tm_tm_gender_imbalance.json")
    get_artists_gender_balance(all_data, outf="data-for-plots/tm_artists_gender_imbalance.json")

    # plot 2
    get_tm_frequency(all_data)

    # create a big dataset centered on text/music
    part_data = get_dict(json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data/all_participants_all_data_2002_2014_2.json"), encoding="utf-8"))
    post1_data = get_texterna_dict(json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data/texterna_sent_lovew_counts.json"), encoding="utf-8")["data"])


    get_tm_centric_data(all_data, part_data, post1_data, outf="data-for-plots/tm_data_10_most_prolific.json", n=10)
    get_tm_centric_data(all_data, part_data, post1_data, outf="data-for-plots/tm_all_data.json", n=None)

