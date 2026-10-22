#!/usr/bin/env python3
"""Small scheduled public smoke check. No customer information or secrets."""
import urllib.request
checks={'/':'Wizekin','/clearquote/':'ClearQuote','/craftcost/':'CraftCost Studio','/stocksimple/':'StockSimple Studio','/lessonsheet/':'LessonSheet Studio','/sitemap.xml':'/craftcost/','/studio-assets/models.js':'worksheet'}
for path,expected in checks.items():
 with urllib.request.urlopen('https://wizekin.web.app'+path,timeout=25)as r:
  assert r.status==200,(path,r.status)
  assert expected in r.read().decode(),(path,'Expected content missing')
 print('OK',path)
