__author__ = 'luminitamoruz'

import os
import json
import subprocess
import random

import numpy

from compute_features import Song

def load_data(fname):
    data = {}
    feature_names = []
    for d in json.load(open(fname), encoding="utf-8"):
        s = Song(d["song_id"], d["song_name"], d["artist"], d["qid"], d["final_placing"])
        s.feature_values = d["feature_values"]
        s.scaled_feature_values = d["scaled_features"]
        data[d["song_id"]] = s

        if not feature_names:
            feature_names = [p[0] for p in s.feature_values]
    return data, feature_names


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
    train_data = [s for s in songs_in_final if s.qid not in test_qids]
    print_scaled_features_to_files(train_data, feature_names, train_file)

    test_file = os.path.join(out_dir, "test.txt")
    test_data = [s for s in songs_in_final if s.qid in test_qids]
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

def train_model(train_file, outdir, c):
    svm_train = "../svm_light_osx.8.4_i7/svm_learn"

    model_file = os.path.join(outdir, 'model.txt')
    alphas_file = os.path.join(outdir, "alphas.txt")
    #if gamma:
    #    return_code = subprocess.call([svm_train, "-a", alphas_file, '-z', 'p', '-c', str(c), '-t', "2", '-g', str(gamma),
    #                               train_file, model_file])
    #else:
    return_code = subprocess.call([svm_train, "-a", alphas_file, '-z', 'p', '-c', str(c), train_file, model_file])

    print "Training finished with return code {}".format(return_code)
    return model_file


def test_model(test_file, model_file, outdir):
    svm_test = "../svm_light_osx.8.4_i7/svm_classify"

    predictions_file = os.path.join(outdir, "predictions.txt")
    return_code = subprocess.call([svm_test, test_file, model_file, predictions_file])

    print "Testing finished with return code {}".format(return_code)
    return predictions_file


# def simulate_random_distance():
#     distances = []
#     l = range(1, 11)
#     weights = [10, 5, 4, 3, 2, 1, 1, 1, 1, 1]
#     for i in range(10000):
#         random.shuffle(l)
#         d = sum( [numpy.abs(i - l[i-1])*weights[i-1] for i in range(1, 11)] )
#         distances.append(d)
#     print "Average distance (random simulation): ", numpy.average(distances)


def print_predictions_to_file(test_data, test_qids, outfile):
    outf = open(outfile, "w")
    test_data.sort(key=lambda s: s.svm_predicted_rank_score)
    distance = 0
    for qid in test_qids:
        i = 1
        outf.write("---- Year: {} ----".format(qid))
        for s in [t for t in test_data if t.qid == qid]:
            if outfile:
                if s.final_placing != -1:
                    outf.write("{} - '{}': predicted position, real position: {}, {}\n".format(s.artist.encode("utf-8"),
                                                                                s.song_name.encode("utf-8"),
                                                                                i,
                                                                                s.final_placing))
                else:
                    outf.write("{} - '{}': predicted position: {}\n".format(s.artist.encode("utf-8"),
                                                                            s.song_name.encode("utf-8"), i))

            i += 1
    outf.close()

def print_predictions(test_data, test_qids):
    # print predictions
    test_data.sort(key=lambda s: s.svm_predicted_rank_score)
    distance = 0
    for qid in test_qids:
        i = 1
        print "---- Year: {} ----\n".format(qid)
        for s in [t for t in test_data if t.qid == qid]:
            print "{} - '{}': predicted position, real position: {}, {}".format(s.artist.encode("utf-8"),
                                                                                s.song_name.encode("utf-8"),
                                                                                i,
                                                                                s.final_placing)
            i += 1

def compute_prediction_error(test_data):
    penalties  = [5, 2, 1]
    error = 0
    for t in test_data:
        print t.qid, t.final_placing, t.predicted_final_placing
        if t.final_placing <= 3 or t.predicted_final_placing <= 3:
            diff = numpy.abs(t.final_placing -  t.predicted_final_placing)
            for i in range(len(penalties)):
                if t.final_placing == i + 1 or  t.predicted_final_placing == i + 1:
                    error += diff * penalties[i]

    return error

def optimization_train_model(data, feature_names, outdir, c):

    testing_sets = [[2002, 2005, 2008, 2011, 2014], [2003, 2006, 2009, 2012], [2004, 2007, 2010, 2013]]
    prediction_error = 0
    for test_qids in testing_sets:
        # remove files
        for f in os.listdir(outdir):
            os.remove(os.path.join(outdir, f))

        # write train and test data
        train_file, train_data, test_file, test_data = write_train_test_data(data, feature_names, outdir, test_qids)

        # training
        model_file = train_model(train_file, outdir, c)

        # testing
        predictions_file = test_model(test_file, model_file, outdir)

        # merge the data with the predictions
        for (s, p) in zip(test_data, open(predictions_file).readlines()):
            s.svm_predicted_rank_score = float(p)
        test_data.sort(key=lambda s: s.svm_predicted_rank_score)


        rank = {}
        for qid in test_qids:
            rank[qid] = 1

        for t in test_data:
            t.predicted_final_placing = rank[t.qid]
            rank[t.qid] += 1

        prediction_error += compute_prediction_error(test_data)

        # print predictions
        # print_predictions(test_data, test_qids)
        # print "Prediction error: ", prediction_error

    return prediction_error

def train_final_model(data, feature_names, outdir, c):

    #for f in os.listdir(outdir):
    #    os.remove(os.path.join(outdir, f))

    # write train and test data
    train_file, train_data, test_file, test_data = write_train_test_data(data, feature_names, outdir, [2015])

    # training
    model_file = train_model(train_file, outdir, c)

    predictions_file = test_model(test_file, model_file, outdir)

    # merge the data with the predictions
    for (s, p) in zip(test_data, open(predictions_file).readlines()):
        s.svm_predicted_rank_score = float(p)

    test_data.sort(key=lambda s: s.svm_predicted_rank_score)
    i = 1
    for t in test_data:
        t.predicted_final_placing = i
        print "Final placing ",  t.predicted_final_placing

        i += 1

    print_predictions(test_data, [2015])
    print_predictions_to_file(test_data, [2015], os.path.join(outdir, "final_predictions.txt"))

    return model_file


def get_feature_weights(model_file, feature_names, out_dir):
    tmp_outfile =os.path.join(out_dir, "tmp.txt")
    python_path = "/Users/luminitamoruz/work/deliciosa/text-analysis/my-python/bin/python"
    weights_script = "/Users/luminitamoruz/work/deliciosa/posts/winners/scripts/get_weights.py"
    return_code = subprocess.call([python_path, weights_script, model_file], stdout=open(tmp_outfile, "w"))
    print "Code", return_code, tmp_outfile
    outf = open(os.path.join(out_dir, "final_feature_weights.txt"), "w")
    lines = open(tmp_outfile).readlines()
    print lines

    t = []
    for (fname, fvalue) in zip(feature_names, lines[1:] ):
        fval = abs(float(fvalue.split(":")[1].strip()))
        t.append((fname, fval))

    t.sort(key = lambda p: p[1], reverse=True)
    for (fname, fval) in t:
        outf.write(str(fname) + " : " + str(fval) + "\n")
        print (fname, fval)
    outf.close()


def main():
    fname = "../data/feature_data.json"
    data, feature_names = load_data(fname)

    # remove any file from the tmp directory
    outdir =  "/Users/luminitamoruz/work/deliciosa/posts/winners/tmp/"

    print "\n---- Optimizing parameters"

    parameters = []
    train_data = [d for d in data.values() if d.qid != 2015]
    for c in [3, 5, 7, 10, 13, 16, 19, 22, 25]:
        prediction_error = optimization_train_model(train_data, feature_names, outdir, c)
        parameters.append((c, prediction_error))

    print "\n ---- Build final model and calculate predictions"
    parameters.sort(key=lambda p: p[1])
    print parameters

    outdir = "/Users/luminitamoruz/work/deliciosa/frontend/data"
    model_file = train_final_model(data.values(), feature_names, outdir, parameters[0][0])
    get_feature_weights(model_file, feature_names, outdir)



if __name__ == '__main__':
    main()