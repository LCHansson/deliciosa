# -*- coding: utf-8 -*-
__author__ = 'luminitamoruz'

import json
from itertools import combinations

import networkx as nx


def get_id_of_all_tms(all_data):
    vals = all_data.values()
    vals.sort(key = lambda d: d["tm_list"][0])
    tm_ids = {}
    i = 0
    for song in all_data.values():
        for tm in song["tm_list"]:
            if not tm in tm_ids:
                tm_ids[tm] = i
                i += 1

    ids_tm = {}
    for k, v in tm_ids.iteritems():
        if v in ids_tm:
            print "ERROR!"
        ids_tm[v] = k

    return tm_ids, ids_tm

def tms_with_only_one_song():
     data = json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data-for-plots/tm_all_data.json"),
                     encoding="utf-8")
     tms_with_one_song = []
     for d in data:
         if len(d["songs"]) == 1 and d["tm"] not in tms_with_one_song:
             tms_with_one_song.append((d["tm"]))
     print len(tms_with_one_song), " have one song"
     return tms_with_one_song


def tms_that_worked_with_top10(all_data):
    top10 = set(["Bobby Ljunggren", "Thomas G:son", "Henrik Wikström", "Fredrik Kempe",
             "Tim Larsson", "Peter Boström", "Tobias Lundgren", "Johan Fransson",
             "Ingela \"Pling\" Forsman", "Niklas Edberger"])

    ret = set([])
    all_tms = set([])
    for a in all_data.values():
        s = set(a["tm_list"])
        all_tms = all_tms.union(s)
        if len(s.intersection(top10)) > 0:
            ret = ret.union(s)

    return list(all_tms.difference(ret))


def build_graph(all_data):
    graph = nx.Graph()

    top10 = set(["Bobby Ljunggren", "Thomas G:son", u"Henrik Wikström", "Fredrik Kempe",
             "Tim Larsson", u"Peter Boström", "Tobias Lundgren", "Johan Fransson",
             "Ingela \"Pling\" Forsman", "Niklas Edberger"])
    tm_ids, ids_tm = get_id_of_all_tms(all_data)
    for song in all_data.values():
        tms = set(song["tm_list"])
        tms_in_top10 = tms.intersection(top10)

        if len(tms_in_top10) == 0:
            continue

        # add everyone as nodes
        ids = [(tm_ids[tm], tm) for tm in song["tm_list"]]
        for id, tm in ids:
            if not graph.__contains__(id):
                if tm in top10:
                    print "In top 10:", tm
                    graph.add_node(id, name=tm, group=0)
                else:
                    graph.add_node(id, name=tm, group=1)

        # add the edges
        # edges between all in top 10
        top10_ids = [(tm_ids[tm], tm) for tm in tms_in_top10]
        for comb in combinations(top10_ids, 2):
            if graph.has_edge(comb[0][0], comb[1][0]):
                graph.edge[comb[0][0]][comb[1][0]]["weight"] += 1
            else:
                graph.add_edge(comb[0][0], comb[1][0], weight=1)

        # add edges between those in top 10 and all others
        not_in_top10 = [(tm_ids[tm], tm) for tm in tms.difference(top10)]
        for source in top10_ids:
            for target in not_in_top10:
                if graph.has_edge(source[0], target[0]):
                    graph.edge[source[0]][target[0]]["weight"] += 1
                else:
                    graph.add_edge(source[0], target[0], weight=1)

    return graph


"""
def build_graph(all_data):
    graph = nx.Graph()

    #tms_with_one_song = tms_with_only_one_song()
    tms_that_workedwith10 = tms_that_worked_with_top10(all_data)
    tm_ids, ids_tm = get_id_of_all_tms(all_data)
    for song in all_data.values():
        tms = [t for t in song["tm_list"] if t not in tms_that_workedwith10]

        # add them as nodes
        ids = [(tm_ids[tm], tm) for tm in tms]
        for id, tm in ids:
            if graph.__contains__(id):
                graph.node[id]["nsongs"] += 1
            else:
                graph.add_node(id, name=tm, nsongs=1)

        # add the edges
        for comb in combinations(ids, 2):
            if graph.has_edge(comb[0][0], comb[1][0]):
                graph.edge[comb[0][0]][comb[1][0]]["weight"] += 1
            else:
                graph.add_edge(comb[0][0], comb[1][0], weight=1)

    return graph
"""

def fix_connected_components(graph):
    copy_graph = graph.copy()
    group = 0
    for c in nx.connected_components(copy_graph):
        if len(c) == 1:
            graph.remove_node(c[0])
        else:
            for node in c:
                graph.node[node]["group"] = group
            group += 1

    return graph

def print_graph(graph):
    print "------- THE GRAPH -------"
    res = graph.nodes(data=True)
    res.sort(key=lambda v: v[0])
    print "--Nodes: ",len(res)
    #for r in res:
    #    print r

    edges = graph.edges(data=True)
    edges.sort(key=lambda v: v[2]["weight"])
    print "--Edges: ",len(edges)
    #for e in edges:
    #    print e


def print_graph2file(graph, nodes_file, edges_file):
    res = graph.nodes(data=True)
    res.sort(key=lambda v: v[0])
    outf = open(nodes_file, "w")
    outf.write("name, group\n")
    counter = 0
    new_mapping = {}
    for n in res:
        new_mapping[n[0]] = counter
        counter += 1
        outf.write(n[1]["name"].encode("utf-8") + "," + str(n[1]["group"]) + "\n")
    outf.close()

    edges = graph.edges(data=True)
    edges.sort(key=lambda v: v[2]["weight"], reverse=True)
    outf = open(edges_file, "w")
    outf.write("source, target, value\n")
    for e in edges:
        outf.write(str(new_mapping[e[0]]) + "," + str(new_mapping[e[1]]) + "," + str(e[2]["weight"]) + "\n")
    outf.close()


if __name__ == '__main__':
    all_data = json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data/all_participants_data_2002_2014_gender_curated.json"), encoding="utf-8")
    #all_data = json.load(open("/Users/luminitamoruz/work/deliciosa/posts/tm/data/test.json"), encoding="utf-8")

    # build the graph
    graph = build_graph(all_data)
    print_graph(graph)

    # calculate connected components, remove components with one element, and add the group
    #final_graph = fix_connected_components(graph)
    #print_graph(final_graph)

    # write the graph to a file
    print_graph2file(graph, "/Users/luminitamoruz/work/deliciosa/posts/tm/data/nodes.csv",
                     "/Users/luminitamoruz/work/deliciosa/posts/tm/data/edges.csv")