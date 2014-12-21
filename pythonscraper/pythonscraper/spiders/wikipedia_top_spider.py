# -*- coding: utf-8 -*-
from scrapy.spider import Spider

import sys
sys.path.append("/Users/luminitamoruz/work/deliciosa/pythonscraper/pythonscraper")
import items
import json 
import urllib


class WikipediaSpider(Spider):
    DOMAIN = "sv.wikipedia.org"
    SKIP_LIST = [u'[', u']']

    name = "wikipedia_top_mello"
    allowed_domains = [DOMAIN]
    # before 2012

    start_urls = [
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2002",
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2003",
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2004",
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2005",
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2006",
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2007",   
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2008",   
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2009",   
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2010",   
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2011",   
       # "http://sv.wikipedia.org/wiki/Melodifestivalen_2012",   
         
    ]
    start_urls = [
        #"http://sv.wikipedia.org/wiki/Melodifestivalen_2013",   
        "http://sv.wikipedia.org/wiki/Melodifestivalen_2014",   
   ]

    def _is_start_positions_table(self, table):     
        header_rows = table.css("tr th").extract()
        if len(header_rows) != 5:
            return False
        s = " ".join(table.css("tr th::text").extract())
        if s.find(u"Upphovsmän") == -1  or s.find(u"Låt") == -1 or s.find(u"#") == -1 or s.find(u"Del") == -1:
            return False
        return True
    
    def _get_start_order(self, tables):
        start_table = [t for t in tables if self._is_start_positions_table(t)]
        if len(start_table) == 0:
            print "ERROR: could not find the table including the start order"
            return 
        if len(start_table) > 1:
            print "ERROR: more than one candidate for the table including the order. Refine the filter!"
            return
        
        start_order = {}
        rows = start_table[0].css("tr")
        for r in rows[1:]:
            pos = r.css("td:nth-child(1)::text").extract()[0]
            song =  ''.join(r.css("td:nth-child(3) a::text").extract()).replace('"', "").strip()
            start_order[song] = pos
        return start_order
        
    def _is_final_results_table(self, table):     
        header_rows = table.css("tr th").extract()
        s = " ".join(table.css("tr th::text").extract()).lower()
        if s.find(u"jury") == -1 or s.find(u"poäng") == -1:
            return False
        return True
    
    def _get_final_results_table(self, tables):
        final_results_table = [t for t in tables if self._is_final_results_table(t)]
        if len(final_results_table) == 0:
            print "ERROR: could not find the table including the final results"
            return 
        if len(final_results_table) > 1:
            print "ERROR: more than one candidate for the table including the final results. Refine the filter!"
            return
        return final_results_table[0]
        
    def _get_column_index(self, table, keywords):
        header_rows = table.css("tr th")
        idx = -1
        for i in range(len(header_rows)):
            all_text = header_rows[i].extract()
            if all([all_text.lower().find(keyword) != -1 for keyword in keywords]):
                idx = i + 1
                break
        return idx 


    def _get_formatted_text(self, css_selector, object):
        val = object.css(css_selector + "::text").extract()
        if not val:
            val = object.css(css_selector + " i::text").extract()
        if not val:
            val = object.css(css_selector + " b::text").extract()
        if val:
            return val[0]

        return val

    def _is_year(self, response, years):
        for year in years:
            if response.url.split("/")[4].find(year) != -1:
                return True
        return False

    def parse(self, response):
        entry = items.ResultItem()

        # start with the table giving the start order
        tables = response.css(".wikitable")
        start_order = self._get_start_order(tables)
        print "START ORDER: ", start_order

        # now go to the table with the results 
        final_results_table = self._get_final_results_table(tables)
        # get the index of the columns of interest 
        jury_points_idx = self._get_column_index(final_results_table, [u"jury-"])
        tel_points_idx = self._get_column_index(final_results_table, [u"tel", u"poäng"])
        final_place_idx = self._get_column_index(final_results_table, [u"plac"])
        if jury_points_idx == -1 or tel_points_idx == -1 or final_place_idx == -1:
            if self._is_year(response, ["2013"]):
                jury_points_idx = 14
                tel_points_idx = 17
                final_place_idx = 19
            else:
                print "ERROR: unable to get the index of the columns of interest: ", jury_points_idx, tel_points_idx, final_place_idx
                return 

        filename = response.url.split("/")[4] + "_result.json"
        f = open(filename, "wb")
        f.write("[\n")
        results = []
        rows = final_results_table.css("tr")[1:]
        if self._is_year(response, ["2013"]):
            rows = rows[1:]
        for r in rows:
            song =  ''.join(r.css("td:nth-child(2) a::text").extract()).replace('"', "").strip()
            if not song:
                song = r.css("td:nth-child(2)::text").extract()[0].replace('"', "").replace(u"”", "").replace(u"”","").strip()

            jury_points = self._get_formatted_text("td:nth-child(" + str(jury_points_idx) + ")", r)
            tel_points = self._get_formatted_text("td:nth-child(" + str(tel_points_idx) + ")", r) 
            if self._is_year(response, ["2013", "2014"]):
                final_place = self._get_formatted_text("td:nth-child(" + str(final_place_idx) + ")", r)
            else:
                final_place = r.css("td:nth-child(" + str(final_place_idx) + ")::text").extract()[0]
            
            p = items.ResultItem()
            p['startposition_final'] = -1
        
            if song in start_order:
                p['startposition_final'] = start_order[song]
            p["song"] = song
            p["jury_points"] = jury_points
            p["tel_points"] = tel_points
            p["final_place"] = final_place

            line = json.dumps(dict(p), ensure_ascii=False, indent=4, sort_keys=True) + ",\n"   
            f.write(line.encode("utf-8"))

            results.append(p)
        f.write("\n]")
        f.close()    
     
        return results
