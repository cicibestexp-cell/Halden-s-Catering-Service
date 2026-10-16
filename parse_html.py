from html.parser import HTMLParser

class SectionParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.sections = {}
        self.current_sections = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        is_section = False
        section_id = None
        if tag == 'div':
            classes = attr_dict.get('class', '').split()
            if 'section' in classes:
                is_section = True
                section_id = attr_dict.get('id')
                if section_id:
                    self.sections[section_id] = list(self.current_sections)
                    self.current_sections.append(section_id)
        
        self.stack.append((tag, is_section, section_id))

    def handle_endtag(self, tag):
        # find the last matching tag
        for i in reversed(range(len(self.stack))):
            if self.stack[i][0] == tag:
                _, is_section, section_id = self.stack.pop(i)
                if is_section and section_id:
                    self.current_sections.remove(section_id)
                break

parser = SectionParser()
with open('admin.html', encoding='utf-8') as f:
    parser.feed(f.read())

for sid, parents in parser.sections.items():
    if parents:
        print(f'{sid} is nested inside: {", ".join(parents)}')
    else:
        print(f'{sid} is at the root level')
