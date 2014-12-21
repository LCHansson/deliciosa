# -*- coding: utf-8 -*-
import sys 
sys.path.append("/Users/luminitamoruz/work/deliciosa/pythonscraper/pythonscraper")
import json

from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import HtmlXPathSelector
import items

class SVTSpider(CrawlSpider):
    name = "svt"
    allowed_domains = ["svt.se"]
    start_urls = ["http://www.svt.se/melodifestivalen/alla-latar-som-tavlat-i-melodifestivalen-2012"]
    
    link_extractor = SgmlLinkExtractor(allow=("http://svt.se/melodifestivalen/2012", ), restrict_xpaths=())
    rules = (Rule(link_extractor, callback="parse_items", follow= True),)

    def parse_items(self, response):
        hxs = HtmlXPathSelector(response)

        lyrics_item = items.LyricsItem()
        # get the title (which is also the name of the song)
        song = hxs.xpath('//title/text()').extract()[0]
        if song.find(u"–") != -1:
            song = song.split(u"–", 1)[1]
        if song.find(":") != -1:
            song = song.split(":", 1)[0]
        lyrics_item["song"] = song.strip()
        
        # get the text 
        text_paragraphs = hxs.xpath('//h4[@class=" svtH5-THEMED"]/following-sibling::p/text()').extract()
        lyrics_item["lyrics"] = u""
        for p in text_paragraphs:
            lyrics_item["lyrics"] += p + "\n"
        lyrics_item["lyrics"] = lyrics_item["lyrics"]
            
        # write to a file
        f = open("2012_lyrics.json", "a")
        line = json.dumps(dict(lyrics_item), ensure_ascii=False, indent=4, sort_keys=True) + ",\n"   
        f.write(line.encode("utf-8"))
        f.close()
        return [lyrics_item]
