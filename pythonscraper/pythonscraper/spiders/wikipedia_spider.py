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

    name = "wikipedia_mello"
    allowed_domains = [DOMAIN]
    # before 2012
    """
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
    ]
    """
    start_urls = [
        # "http://sv.wikipedia.org/wiki/Melodifestivalen_2012",   
        #"http://sv.wikipedia.org/wiki/Melodifestivalen_2013",   
        "http://sv.wikipedia.org/wiki/Melodifestivalen_2014",   
   ]

    def _get_formatted_text(self, css_selector, object):
        val = object.css(css_selector + "::text").extract()
        if not val:
            val = object.css(css_selector + " i::text").extract()
        if val:
            return val[0]
        return val

    def _is_deltavling_table(self, table):     
        header_rows = table.css("tr th").extract()
        if len(header_rows) != 8:
            return False
        s = " ".join(table.css("tr th::text").extract())
        if s.find(u"Röster") == -1 or s.find("Musik") == -1:
            return False
        return True

    def _is_deltavling_table_after_2012(self, table):     
        header_rows = table.css("tr th").extract()
        if len(header_rows) != 9:
            return False
        s = " ".join(table.css("tr th::text").extract())
        if s.find(u"Röster") == -1 or s.find("Musik") == -1:
            return False
        return True


    def parse(self, response):
        entry = items.ParticipantItem()
        #unicode(response.body.decode(response.encoding)).encode('utf-8')
        filename = response.url.split("/")[4] + ".json"
        tables = response.css(".sortable")
        relevant_tables = [t for t in tables if self._is_deltavling_table(t)]
        table_after_2012 = False
        if not relevant_tables:
            relevant_tables = [t for t in tables if self._is_deltavling_table_after_2012(t)]
            if relevant_tables:
                table_after_2012 = True
            else:
                print "No table found"
                return []
        if len(relevant_tables)>4:
            print "Warning: found ", len(relevant_tables), " tables, keep the first 4"
            relevant_tables = relevant_tables[0:4]
            

        f = open(filename, "wb")
        participants = []
        round_number = 1
        f.write("[\n")
        for t in relevant_tables:
            rows = t.css("tr")
            for r in rows[1:]:
                p = items.ParticipantItem()
                p["round"] = round_number
                p["startposition"] = r.css("td:nth-child(1)::text").extract()[0]
                p["artist"] = " & ".join(r.css("td:nth-child(2) a::text").extract())
                p["artist_wikilink"] = " & ".join([self.DOMAIN + l for l in r.css("td:nth-child(2) a::attr(href)").extract()])
                
                p["song"] = r.css("td:nth-child(3) a::text").extract()
                if not p["song"]:
                    p["song"] = " ".join([sp.strip().replace('"', '').replace(u'”', u'') for sp in r.css("td:nth-child(3)::text").extract()])
                else:
                    p["song"] = p["song"][0]

                names = [v for v in r.css("td:nth-child(4) a::text").extract() if not v in self.SKIP_LIST]
                textmusic = [v.strip() for v in r.css("td:nth-child(4)::text").extract() if len(v.strip()) > 0]
                if len(names) > 0 and not textmusic:
                    textmusic = ["()"]*len(names)
                    
                if len(names) > len(textmusic):
                    print "WARNING, CHECK NAMES FOR: "
                    print "Song=", p["song"]
                    print "Names=", names
                    print "Text music:", textmusic
                    for j in range(len(names) - len(textmusic)):
                        textmusic.append("()")

                p["textmusic"] = " & ".join([names[i] + str(textmusic[i]) for i in range(len(names))])
                p["textmusic_wikilinks"] = " & ".join([self.DOMAIN + l for l in r.css("td:nth-child(4) a::attr(href)").extract()])
                
                votes1 = self._get_formatted_text("td:nth-child(5)", r)
                votes2 = self._get_formatted_text("td:nth-child(6)", r)
                if votes1:
                    p["votes_round1"] = votes1.replace(u'\xa0', u'')
                else:
                    p["votes_round1"] = "-"

                if votes2:
                    p["votes_round2"] = votes2.replace(u'\xa0', u'')
                else:
                    p["votes_round2"] = "-"
    

                place_col_index = "7"
                remark_col_index = "8"
                if table_after_2012:
                    place_col_index = "8"
                    remark_col_index = "9"
                
                p["place"] = r.css("td:nth-child(" + place_col_index + ")::text").extract()[0]

                remark = r.css("td:nth-child("+ remark_col_index +")::text").extract()                
                if not remark:
                    remark = r.css("td:nth-child("+ remark_col_index +") a::text").extract()[0]
                elif type(remark) is list:
                    remark = remark[0]
                p["remark"] = remark

                line = json.dumps(dict(p), ensure_ascii=False, indent=4, sort_keys=True) + ",\n"   
                f.write(line.encode("utf-8"))

                participants.append(p)
            round_number += 1
        f.write("\n]")
        
        
        f.close()    
     
        return participants
