import re

with open('c:\\Users\\Admin\\Desktop\\SMARTSERVE\\customer.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove google fonts link
text = re.sub(r'<link[^>]*href="https://fonts\.googleapis\.com/css2\?family=[^>]*>', '', text)

# Remove all font-family CSS properties
# Match font-family: something; or font-family: something" or font-family: something
text = re.sub(r'font-family\s*:[^;"]+[;]?', '', text)

with open('c:\\Users\\Admin\\Desktop\\SMARTSERVE\\customer.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")
