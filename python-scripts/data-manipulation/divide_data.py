import json
import sys
from curate_data import encode_data

def divide_data(data_json):
    data = json.load(open(data_json), encoding="utf-8")
    
    winners = []
    losers = []
    # retain only the entries that have lyrics and some echonest variable
    have_echonest = lambda entry: entry["echonest_speechiness"] != -1000
    filtered_data = [d for d in data if have_echonest(d) and d["lyrics"]]
    
    print "INFO: {}/{} have echonest and lyrics".format(len(filtered_data), len(data))
    for entry in filtered_data:
        if entry["final_placing"] != -1 and  entry["final_placing"] <= 4:
            winners.append(entry)

        if entry["prel_placing"] >= 7:
            losers.append(entry)

    print "INFO: {} winners, {} losers".format(len(winners), len(losers))
    return winners, losers 

def write_to_json(jsonf, data):
    obj = open(jsonf, "w") 
    json.dump(data, obj, indent=4, sort_keys=True, encoding="utf-8", ensure_ascii=False)
    obj.close()

if __name__ == '__main__':
    data_json = sys.argv[1]
    winners, losers = divide_data(data_json)
    write_to_json("winners.json", encode_data(winners))
    write_to_json("losers.json", encode_data(losers))





            
            


