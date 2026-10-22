#!/usr/bin/env python3
"""Check new public pages, static links, metadata and script syntax without dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import xml.etree.ElementTree as ET
import subprocess
ROOT=Path(__file__).resolve().parents[1];PUBLIC=ROOT/'public'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.refs=[];self.canonical=[];self.title=False;self.description=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id'in a:assert a['id']not in self.ids, f'Duplicate ID {a["id"]}';self.ids.add(a['id'])
  if tag=='title':self.title=True
  if tag=='meta'and a.get('name')=='description':self.description=True
  if tag=='link'and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  for k in ['href','src']:
   if a.get(k):self.refs.append(a[k])
urls={e.text for e in ET.parse(PUBLIC/'sitemap.xml').getroot().iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
count=0
for slug in ['craftcost','stocksimple','lessonsheet']:
 for path in (PUBLIC/slug).rglob('*.html'):
  parser=Page();parser.feed(path.read_text());assert parser.title and parser.description,path;assert len(parser.canonical)==1,path
  expected='https://wizekin.web.app/'+path.relative_to(PUBLIC).as_posix();expected=expected.removesuffix('index.html')
  assert parser.canonical==[expected],(path,parser.canonical,expected);assert expected in urls,expected
  for ref in parser.refs:
   u=urlparse(ref)
   if u.scheme or u.netloc or not u.path:continue
   target=(PUBLIC/unquote(u.path.lstrip('/')))if u.path.startswith('/')else path.parent/unquote(u.path)
   if target.is_dir():target=target/'index.html'
   assert target.is_file(),(path,ref)
  count+=1
for path in [* (PUBLIC/'studio-assets').glob('*.js'),*(PUBLIC/slug/'app.js'for slug in ['craftcost','stocksimple','lessonsheet'])]:subprocess.run(['node','--check',str(path)],check=True)
assert all((PUBLIC/slug/'index.html').is_file()for slug in ['craftcost','stocksimple','lessonsheet'])
assert 'premium'not in str([p for p in PUBLIC.rglob('*.zip')])
print(f'Checked {count} new pages: metadata, canonical URLs, sitemap, links, IDs, and JavaScript syntax.')
