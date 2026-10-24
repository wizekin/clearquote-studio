#!/usr/bin/env python3
"""Small scheduled public smoke check. No customer information or secrets."""
import urllib.request
checks={'/panelnest/':'PanelNest','/panelnest/engine.js':'function solve','/panelnest/app.js':'function arrange','/panelnest/guides/sheet-cutting-with-kerf-and-grain.html':'Leave room','/':'Wizekin','/clearquote/':'ClearQuote','/craftcost/':'CraftCost Studio','/stocksimple/':'StockSimple Studio','/lessonsheet/':'LessonSheet Studio','/framemint/':'FrameMint','/studymap/':'StudyMap','/labelleaf/':'LabelLeaf','/sitemap.xml':'/framemint/','/studio-assets/models.js':'worksheet','/studio-assets/collection-models.js':'function study'}
for path,expected in checks.items():
 with urllib.request.urlopen('https://wizekin.web.app'+path,timeout=25)as r:
  assert r.status==200,(path,r.status)
  assert expected in r.read().decode(),(path,'Expected content missing')
 print('OK',path)
