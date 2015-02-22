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


def compute_basic_features(songs_in_final, feature_names):
    """
    Extract basic features from the bulk of data
    """
    fname = "../data/all_participants_all_data_2002_2014_2.json"
    data4songs_in_final = [d for d in json.load(open(fname), encoding="utf-8")
                           if d["final_start_position"] != -1]


    feature_names += ["prel_round_no", "prel_start_position", "prel_placing",
                      "final_start_position",
                      "echonest_tempo", "echonest_loudness",
                      "language"]
    for d in data4songs_in_final:
        # qid
        if d["id"] in songs_in_final:
            s = songs_in_final[d["id"]]
        else:
            qid = d["year"] - 2001
            s = Song(d["id"], d["song_name"], d["artist"], qid, d["final_placing"])
            songs_in_final[s.song_id] = s

        # get the features
        for feat_name in feature_names:
            if feat_name == "language":
                if d[feat_name] == "swedish":
                    s.feature_values.append(0)
                elif d[feat_name] == "english":
                    s.feature_values.append(1)
                else:
                    s.feature_values.append(2)
            else:
                s.feature_values.append(d[feat_name])

    return songs_in_final, feature_names


def compute_tm_artist_features(songs_in_final, feature_names):
    fname = "../data/all_participants_data_2002_2014_gender_curated.json"
    data = json.load(open(fname), encoding="utf-8")

    # gender tm is "0" for men, 1 for women, 2 for mixed, 3 for unknown
    feature_names += ["is_band",
                      "number_tm", "gender_tm"]#, "is_kempe_involved"]
    for sid, d in data.iteritems():
        if sid in songs_in_final:
            # is_band?
            is_band = 0
            if len(d["artist_gender"]) > 1 or d["artist_gender"][0] == "U":
                is_band = 1
            songs_in_final[sid].feature_values.append(is_band)

            # how many tms?
            songs_in_final[sid].feature_values.append(len(d["tm_list"]))

            # what genders do the tms have
            sg = set(d["tm_genders"])
            if len(sg.difference(set(["M"]))) == 0:
                tm_gender = 0
            elif len(sg.difference(set(["F"]))) == 0:
                tm_gender = 1
            elif len(sg.difference(set(["M", "F"]))) == 0:
                tm_gender = 2
            else:
                tm_gender = 3
            songs_in_final[sid].feature_values.append(tm_gender)

            # is kempe involved?
            #if "Fredrik Kempe" in d["tm_list"]:
            #    songs_in_final[sid].feature_values.append(1)
            #else:
            #    songs_in_final[sid].feature_values.append(0)

    return songs_in_final, feature_names


def compute_random_features(songs_in_final, feature_names):
    # gender tm is "0" for men, 1 for women, 2 for mixed, 3 for unknown
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
    min_max_features = [(min(feature_matrix[i]), max(feature_matrix[i]), numpy.average(feature_matrix[i]) )
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
                s.scaled_feature_values[i] = min_max_features[i][2]
                continue
            s.scaled_feature_values[i] = m + (float(s.feature_values[i]) - min_max_features[i][0]) / \
                                          (min_max_features[i][1] - min_max_features[i][0]) * (M-m)

    return songs_in_final

def print_songs(song_dict, feature_names):
    songs = song_dict.values()
    songs.sort(key=lambda s: s.qid)
    for s in songs:
        s.print_song(feature_names)


def print_scaled_features_to_files(songs, feature_names, outfile, rank=True):
    songs.sort(key = lambda s: s.qid)
    outf = open(outfile, "w")
    outf.write("#Features(in this order): {}\n".format(" ".join(feature_names)))
    for s in songs:
        if rank:
            l = "{} qid:{} ".format(s.final_placing, s.qid)
        else:
            l = "0 qid:{} ".format(s.qid)
        i = 1
        for f in s.scaled_feature_values:
            l += "{}:{} ".format(i, f)
            i += 1

        l += "# {}\n".format(s.song_id)
        outf.write(l)

    outf.close()

def write_train_test_data(songs_in_final, feature_names, out_dir, test_qids):
    train_file = os.path.join(out_dir, "train.txt")
    train_data = [s for s in songs_in_final.values() if s.qid not in test_qids]
    print_scaled_features_to_files(train_data, feature_names, train_file)

    test_file = os.path.join(out_dir, "test.txt")
    test_data = [s for s in songs_in_final.values() if s.qid in test_qids]
    print_scaled_features_to_files(test_data, feature_names, test_file, rank=False)

    return train_file, train_data, test_file, test_data

"""
3 qid:1 1:1 2:1 3:0 4:0.2 5:0 # 1A
2 qid:1 1:0 2:0 3:1 4:0.1 5:1 # 1B
1 qid:1 1:0 2:1 3:0 4:0.4 5:0 # 1C
1 qid:1 1:0 2:0 3:1 4:0.3 5:0 # 1D
1 qid:2 1:0 2:0 3:1 4:0.2 5:0 # 2A
2 qid:2 1:1 2:0 3:1 4:0.4 5:0 # 2B
1 qid:2 1:0 2:0 3:1 4:0.1 5:0 # 2C
1 qid:2 1:0 2:0 3:1 4:0.2 5:0 # 2D
2 qid:3 1:0 2:0 3:1 4:0.1 5:1 # 3A
3 qid:3 1:1 2:1 3:0 4:0.3 5:0 # 3B
4 qid:3 1:1 2:0 3:0 4:0.4 5:1 # 3C
1 qid:3 1:0 2:1 3:1 4:0.5 5:0 # 3D
"""

def train_model(train_file, outdir):
    svm_train = "../svm_light_osx.8.4_i7/svm_learn"

    model_file = os.path.join(outdir, 'model.txt')
    alphas_file = os.path.join(outdir, "alphas.txt")
    return_code = subprocess.call([svm_train, "-a", alphas_file, '-z', 'p', '-c', '5',
                                   train_file, model_file])

    print "Training finished with return code {}".format(return_code)
    return model_file


def test_model(test_file, model_file, outdir):
    svm_test = "../svm_light_osx.8.4_i7/svm_classify"

    predictions_file = os.path.join(outdir, "predictions.txt")
    return_code = subprocess.call([svm_test, test_file, model_file, predictions_file])

    print "Testing finished with return code {}".format(return_code)
    return predictions_file


def simulate_random_distance():
    distances = []
    l = range(1, 11)
    weights = [10, 5, 4, 3, 2, 1, 1, 1, 1, 1]
    for i in range(10000):
        random.shuffle(l)
        d = sum( [numpy.abs(i - l[i-1])*weights[i-1] for i in range(1, 11)] )
        distances.append(d)
    print "Average distance (random simulation): ", numpy.average(distances)


def print_predictions(test_data, test_qids):
    # print predictions
    test_data.sort(key=lambda s: s.svm_predicted_rank_score)
    distance = 0
    weights = [10, 5, 4, 3, 2, 1, 1, 1, 1, 1]
    for qid in test_qids:
        i = 1
        print "---- Year: {} ----".format(qid + 2001)
        for s in [t for t in test_data if t.qid == qid]:
            print "Predicted position, real position: {}, {}".format(i, s.final_placing)
            distance += numpy.abs(i - s.final_placing)*weights[i-1]
            i += 1
    print "Distance: ", distance

def main():
    feature_names = []
    songs_in_final = {}

    # get basic features
    songs_in_final, feature_names = compute_basic_features(songs_in_final, feature_names)

    # get features related to tm/artists
    songs_in_final, feature_names = compute_tm_artist_features(songs_in_final, feature_names)

    # random features
    songs_in_final, feature_names = compute_random_features(songs_in_final, feature_names)

    # scale the features to values between 0 and 1; give a dictionary with the indexes of columns containing
    # missing data and the value that indicates that that value is missing
    songs_in_final = scale_features(songs_in_final, feature_names, m=-1.0, M=1.0,
                                    missing_data_feature_indexes={4: -1000, 5: -1000})

    ####################################### SVM

    # write the train and test data
    test_qids = [5]
    outdir =  "/Users/luminitamoruz/work/deliciosa/posts/winners/tmp/"
    for f in os.listdir(outdir):
        os.remove(os.path.join(outdir, f))

    train_file, train_data, test_file, test_data = write_train_test_data(songs_in_final, feature_names, outdir,
                                                                         test_qids)

    model_file = train_model(train_file, outdir)
    predictions_file = test_model(test_file, model_file, outdir)

    # merge the data with the predictions
    for (s, p) in zip(test_data, open(predictions_file).readlines()):
        s.svm_predicted_rank_score = float(p)
        print s.song_id, s.svm_predicted_rank_score

    # print predictions
    print_predictions(test_data, test_qids)


if __name__ == '__main__':
    main()
    #simulate_random_distance()
