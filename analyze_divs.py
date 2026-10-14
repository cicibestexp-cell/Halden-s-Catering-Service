import re

html = open('admin.html', encoding='utf-8').read()
level = 0
for i, line in enumerate(html.split('\n')):
    opens = line.count('<div')
    closes = line.count('</div')
    if '<div class="section"' in line and 'id="section-' in line:
        print(f'Line {i+1}: {line.strip()} - Level: {level}')
    level += opens - closes
print(f'Final level: {level}')
