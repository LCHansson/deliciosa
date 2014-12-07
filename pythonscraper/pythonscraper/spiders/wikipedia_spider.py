# -*- coding: utf-8 -*-
from scrapy.spider import Spider

import sys
sys.path.append("/Users/luminitamoruz/work/deliciosa/pythonscraper/pythonscraper")
import items
import json 
import urllib


class WikipediaSpider(Spider):
    DOMAIN = "sv.wikipedia.org"

    name = "wikipedia_mello"
    allowed_domains = [DOMAIN]
    start_urls = [
        "http://sv.wikipedia.org/wiki/Melodifestivalen_2002",
        "http://sv.wikipedia.org/wiki/Melodifestivalen_2003",
        "http://sv.wikipedia.org/wiki/Melodifestivalen_2004",
        "http://sv.wikipedia.org/wiki/Melodifestivalen_2005",

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

    def parse(self, response):
        entry = items.ParticipantItem()
        #unicode(response.body.decode(response.encoding)).encode('utf-8')
        filename = response.url.split("/")[4] + ".json"
        tables = response.css(".sortable")
        relevant_tables = [t for t in tables if self._is_deltavling_table(t)]
        print "Number of relevant tables:", len(relevant_tables)

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

                p["song"] = r.css("td:nth-child(3) a::text").extract()[0]

                names = r.css("td:nth-child(4) a::text").extract()
                textmusic = [v.strip() for v in r.css("td:nth-child(4)::text").extract() if len(v.strip()) > 0]
                if len(names) > 0 and not textmusic:
                    textmusic = ["()"]*len(names)
 
                print "Song=", p["song"]
                print "Names=", names
                print "Text music:", textmusic
                p["textmusic"] = " & ".join([names[i] + str(textmusic[i]) for i in range(len(names))])
                p["textmusic_wikilinks"] = " & ".join([self.DOMAIN + l for l in r.css("td:nth-child(4) a::attr(href)").extract()])
                
                p["votes_round1"] = self._get_formatted_text("td:nth-child(5)", r).replace(u'\xa0', u'')
                
                p["votes_round2"] = self._get_formatted_text("td:nth-child(6)", r).replace(u'\xa0', u'')
                p["place"] = r.css("td:nth-child(7)::text").extract()[0]

                remark = r.css("td:nth-child(8)::text").extract()                
                if not remark:
                    remark = r.css("td:nth-child(8) a::text").extract()[0]
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
