import json, pathlib
d = pathlib.Path(__file__).parent
data = d.joinpath('data.json').read_text(encoding='utf-8')
html = d.joinpath('template.html').read_text(encoding='utf-8')
d.joinpath('auto-staffing.html').write_text(html.replace('__DATA__', data), encoding='utf-8')
print('built', d.joinpath('auto-staffing.html').stat().st_size, 'bytes')
