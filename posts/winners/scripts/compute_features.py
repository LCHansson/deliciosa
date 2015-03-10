__author__ = 'luminitamoruz'

import json
import os
import sys
import subprocess
import random

import numpy


class Song:
    def __init__(self, song_id, song_name, artist, qid, final_placing):
        self.feature_values = []
        self.scaled_feature_values = []

        self.qid = qid
        self.final_placing = final_placing
        self.song_id = song_id
        self.song_name = song_name
        self.artist = artist

    def print_song(self, feature_names):
        s = u"--- {} (qid={}): {}, Artist: {},  Final placing: {} ---\n".format(self.song_id, self.qid, self.song_name,
                                                                   self.artist, self.final_placing)
        if len(self.scaled_feature_values) > 0:
            for (n, v, vv) in zip(feature_names, self.feature_values, self.scaled_feature_values):
                s += u"{}: {}, scaled: {}\n".format(n, v, vv)
        else:
            for (n, v) in zip(feature_names, self.feature_values):
                s += u"{}: {}\n".format(n, v)

        print s

def get_artist_dict(all_songs):
    ret = {}
    for s in all_songs:
        in_final = 0
        if s["final_start_position"] != -1:
            in_final = 1

        if s["artist"] in ret:
            ret[s["artist"]].append((s["year"], in_final))
        else:
            ret[s["artist"]] = [(s["year"], in_final)]
    return ret

def compute_basic_features(songs_in_final, feature_names):
    """
    Extract basic features from the bulk of data
    """
    fname = "../data/all_participants_all_data_2002_2014_2.json"
    all_songs = [d for d in json.load(open(fname), encoding="utf-8")]
    artist_dict = get_artist_dict(all_songs)
    data4songs_in_final = [d for d in all_songs if d["final_start_position"] != -1
                                                   or d["prel_remark"].lower().strip() == "till final"]


    feature_names += ["prel_round_no", "prel_start_position", "prel_placing",
                      "final_start_position",
                      "echonest_tempo", "echonest_loudness",
                      "language", "directly_to_final", "previous_participating",
                      "previous_in_final"]
    for d in data4songs_in_final:
        # qid
        if d["id"] in songs_in_final:
            s = songs_in_final[d["id"]]
        else:
            qid = d["year"]
            s = Song(d["id"], d["song_name"], d["artist"], qid, d["final_placing"])
            songs_in_final[s.song_id] = s

        # get the basic features
        for feat_name in feature_names[0:6]:
            s.feature_values.append(d[feat_name])

        # get the language
        if d["language"] == "swedish":
            s.feature_values.append(0)
        elif d["language"] == "english":
            s.feature_values.append(1)
        else:
            s.feature_values.append(2)

        # did they go directly to final?
        if d["prel_remark"].lower().find("till final") != -1:
            s.feature_values.append(1)
        else:
            s.feature_values.append(0)

        # previous participations of this artist
        ad = artist_dict[d["artist"]]
        prev_part = [p[1] for p in ad if p[0] < d["year"]]
        if len(prev_part) > 0:
            s.feature_values.append(1)
        else:
            s.feature_values.append(0)

        if sum(prev_part) > 0:
            s.feature_values.append(1)
        else:
            s.feature_values.append(0)

    return songs_in_final, feature_names


def get_tm_dictionary(tm_data):
    fname = "../data/all_participants_all_data_2002_2014_2.json"
    all_songs = [d for d in json.load(open(fname), encoding="utf-8")]

    ret = {}
    for s in all_songs:
        in_final = 0
        in_top_three = 0
        if s["final_start_position"] != -1:
            in_final = 1
            if s["final_start_position"] <= 3:
                in_top_three = 1

        tm_list = tm_data[s["id"]]["tm_list"]
        for tm in tm_list:
            if tm in ret:
                ret[tm].append((s["year"], in_final, in_top_three))
            else:
                ret[tm] = [(s["year"], in_final, in_top_three)]

    return ret


def compute_tm_artist_features(songs_in_final, feature_names):
    fname = "../data/all_participants_data_2002_2014_gender_curated.json"
    data = json.load(open(fname), encoding="utf-8")

    tm_dictionary = get_tm_dictionary(data)

    # gender tm is "0" for men, 1 for women, 2 for mixed, 3 for unknown
    feature_names += ["is_band",
                      "number_tm", "tm_total_previous_participations",
                      "tm_total_previous_in_final", "tm_total_in_top_three"]#, "gender_tm"]#, "is_kempe_involved"]
    for sid, d in data.iteritems():
        if sid in songs_in_final:
            year = int(sid.split("_")[0])
            # is_band?
            is_band = 0
            if len(d["artist_gender"]) > 1 or d["artist_gender"][0] == "U":
                is_band = 1
            songs_in_final[sid].feature_values.append(is_band)

            # how many tms?
            songs_in_final[sid].feature_values.append(len(d["tm_list"]))

            ntotal = 0
            ntotal_in_final = 0
            ntop_three = 0
            for tm in d["tm_list"]:
                n = [p[1] for p in tm_dictionary[tm] if p[0] < year]
                ntotal += len(n)
                ntotal_in_final += sum(n)
                n = [p[2] for p in tm_dictionary[tm] if p[0] < year]
                ntop_three += sum(n)

            songs_in_final[sid].feature_values.append(ntotal)
            songs_in_final[sid].feature_values.append(ntotal_in_final)
            songs_in_final[sid].feature_values.append(ntop_three)

            i = 0
            # # what genders do the tms have
            # sg = set(d["tm_genders"])
            # if len(sg.difference(set(["M"]))) == 0:
            #     tm_gender = 0
            # elif len(sg.difference(set(["F"]))) == 0:
            #     tm_gender = 1
            # elif len(sg.difference(set(["M", "F"]))) == 0:
            #     tm_gender = 2
            # else:
            #     tm_gender = 3
            # songs_in_final[sid].feature_values.append(tm_gender)

            # is kempe involved?
            #if "Fredrik Kempe" in d["tm_list"]:
            #    songs_in_final[sid].feature_values.append(1)
            #else:
            #    songs_in_final[sid].feature_values.append(0)

    return songs_in_final, feature_names


def compute_random_features(songs_in_final, feature_names):
    feature_names += ["number_words_title"]
    for sid in songs_in_final.keys():
        nwords = len(songs_in_final[sid].song_name.split())
        songs_in_final[sid].feature_values.append(nwords)

    return songs_in_final, feature_names


def scale_features(songs_in_final, feature_names, m, M, missing_data_feature_indexes):
    feature_matrix = [[] for i in range(len(feature_names))]
    for s in songs_in_final.values():
        for i in range(len(s.feature_values)):
            # if this is a missing data point do not include it
            if i in missing_data_feature_indexes and s.feature_values[i] == missing_data_feature_indexes[i]:
                continue

            feature_matrix[i].append(s.feature_values[i])

    # calculate min and max for each feature
    min_max_features = [(min(feature_matrix[i]), max(feature_matrix[i]), numpy.average(feature_matrix[i]))
                        for i in range(len(feature_names))]
    # scale the features
    for s in songs_in_final.values():
        s.scaled_feature_values = [0.0 for i in range(len(feature_names))]
        for i in range(len(s.feature_values)):
            if min_max_features[i][1] - min_max_features[i][0] == 0:
                s.scaled_feature_values[i] = float(s.feature_values[i])
                continue

            # MISSING data just put the average of all values
            if i in missing_data_feature_indexes and s.feature_values[i] == missing_data_feature_indexes[i]:
                s.scaled_feature_values[i] = m + (float(min_max_features[i][2]) - min_max_features[i][0]) / \
                                          (min_max_features[i][1] - min_max_features[i][0]) * (M-m)
                continue
            s.scaled_feature_values[i] = m + (float(s.feature_values[i]) - min_max_features[i][0]) / \
                                          (min_max_features[i][1] - min_max_features[i][0]) * (M-m)

    return songs_in_final

def print_songs(song_dict, feature_names):
    songs = song_dict.values()
    songs.sort(key=lambda s: s.qid)
    for s in songs:
        s.print_song(feature_names)

def print_songs_to_file(filename, songs_in_final, feature_names):
    """
            self.feature_values = []
        self.scaled_feature_values = []

        self.qid = qid
        self.final_placing = final_placing
        self.song_id = song_id
        self.song_name = song_name
        self.artist = artist
    """
    d = []
    for s in songs_in_final.values():
        tmp = {"qid": s.qid,
               "final_placing": s.final_placing,
               "song_id": s.song_id,
               "song_name": s.song_name.encode("utf-8"),
               "artist": s.artist.encode("utf-8"),
               "feature_values": zip(feature_names, s.feature_values),
               "scaled_features": s.scaled_feature_values}
        d.append(tmp)
    obj = open(filename, "w")
    json.dump(d, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()


def main():
    feature_names = []
    songs_in_final = {}

    # get basic features
    songs_in_final, feature_names = compute_basic_features(songs_in_final, feature_names)

    # get features related to tm/artists
    songs_in_final, feature_names = compute_tm_artist_features(songs_in_final, feature_names)

    # random features
    songs_in_final, feature_names = compute_random_features(songs_in_final, feature_names)

    # scale the features to values between -1 and 1; give a dictionary with the indexes of columns containing
    # missing data and the value that indicates that that value is missing
    songs_in_final = scale_features(songs_in_final, feature_names, m=0.0, M=1.0,
                                    missing_data_feature_indexes={4: -1000, 5: -1000})

    print_songs_to_file("/Users/luminitamoruz/work/deliciosa/posts/winners/data/feature_data.json",
                        songs_in_final,
                        feature_names)


    ####################################### SVM

    # # write the train and test data
    # test_qids = [2002, 2013, 2014, 2015]
    # outdir =  "/Users/luminitamoruz/work/deliciosa/posts/winners/tmp/"
    # for f in os.listdir(outdir):
    #     os.remove(os.path.join(outdir, f))
    #
    # train_file, train_data, test_file, test_data = write_train_test_data(songs_in_final, feature_names, outdir,
    #                                                                      test_qids)
    #
    # model_file = train_model(train_file, outdir)
    # predictions_file = test_model(test_file, model_file, outdir)
    #
    # # merge the data with the predictions
    # for (s, p) in zip(test_data, open(predictions_file).readlines()):
    #     s.svm_predicted_rank_score = float(p)
    #     print s.song_id, s.svm_predicted_rank_score
    #
    # # print predictions
    # print_predictions(test_data, test_qids)


if __name__ == '__main__':
    main()
    #simulate_random_distance()
