"""Builds the in-app guide pages (Jelly XHTML) from the guide markdown. Run after editing docs/PIVOT_*_Guide.md."""
import markdown, re, sys
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'docs')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'src', 'fluent', 'guides')
CSS = ("body{font-family:Inter,Segoe UI,Arial,sans-serif;color:#142255;max-width:920px;margin:0 auto;padding:32px 24px 64px;line-height:1.55;font-size:15px}"
       "h1{font-size:30px;margin:0 0 4px}h2{font-size:22px;margin:36px 0 8px;border-bottom:1px solid #e3e8f4;padding-bottom:6px}h3{font-size:17px;margin:24px 0 6px}"
       ".sub{color:#5b6b85;margin:0 0 24px}table{border-collapse:collapse;width:100%;margin:10px 0 16px;font-size:14px}th,td{border-bottom:1px solid #e3e8f4;padding:7px 10px;text-align:left;vertical-align:top}"
       "th{background:#f3f6fc}code{background:#f3f6fc;padding:1px 5px;border-radius:4px;font-size:13px}.note{background:#eef3ff;border-radius:8px;padding:10px 14px;color:#304db5}")
for name, slug in [('User', 'user-guide'), ('Admin', 'admin-guide')]:
    md = open(f'{SRC}/PIVOT_{name}_Guide.md', encoding='utf-8').read()
    fm = re.match(r'^---\n(.*?)\n---\n', md, re.S); head = fm.group(1); md = md[fm.end():]
    title = re.search(r'title: "([^"]+)"', head).group(1); sub = re.search(r'subtitle: "([^"]+)"', head).group(1)
    md = re.sub(r'^!\[.*$\n?', '', md, flags=re.M)          # screenshots are in the Word version
    md = re.sub(r'^# ', '## ', re.sub(r'^## ', '### ', md, flags=re.M), flags=re.M)
    body = markdown.markdown(md, extensions=['tables'], output_format='xhtml')
    if '$' in body or '{' in body: raise SystemExit(name + ': "$" or "{" would be read by Jelly')
    body = body.replace('&nbsp;', '&#160;')
    html = ('<?xml version="1.0" encoding="utf-8" ?>\n<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">\n'
            f'<html lang="en"><head><meta charset="utf-8"/><title>{title}</title><style>{CSS}</style></head><body>'
            f'<h1>{title}</h1><p class="sub">{sub}</p><p class="note">The Word version of this guide has a screenshot for every screen.</p>{body}</body></html>\n</j:jelly>\n')
    open(f'{OUT}/{slug}.html', 'w', encoding='utf-8').write(html)
    print(slug, len(html))
