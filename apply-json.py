#!/usr/bin/env python3
import argparse,json,subprocess
p=argparse.ArgumentParser();p.add_argument('file');p.add_argument('--openrgb',default='openrgb');a=p.parse_args()
x=json.load(open(a.file)); colors=[x.get('colors',{}).get(str(i),'000000') for i in range(110)]
if len(colors)!=110 or any(len(c)!=6 for c in colors): raise SystemExit('invalid X1 color JSON')
subprocess.run([a.openrgb,'--device','Thermaltake TT Premium X1 RGB','--mode','Direct','--color',','.join(colors)],check=True)
