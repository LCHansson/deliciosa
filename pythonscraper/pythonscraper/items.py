from scrapy.item import Item, Field

class ParticipantItem(Item):
    round = Field()
    startposition = Field()
    artist = Field()
    artist_wikilink = Field()
    song = Field()
    textmusic = Field()
    textmusic_wikilinks = Field()
    votes_round1 = Field()
    votes_round2 = Field()
    place = Field()
    remark = Field()

class ResultItem(Item):
    
    startposition_final = Field()
    song = Field()
    jury_points = Field()
    tel_points = Field()
    final_place = Field()
