import re

def find_mismatch(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Remove block comments
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    # Remove line comments
    text = re.sub(r'//.*', '', text)

    # We need to remove strings carefully.
    # A simple regex for JS strings:
    # Match double quote strings, single quote strings, backtick strings
    # and regex literals.
    # regex literal: / ... /  (only if preceded by specific chars like = ( , [ { etc, simplified: just hope it works)
    
    # Actually, removing strings and keeping track of line numbers is hard with simple re.sub.
    # Let's do a character by character pass
    
    clean_text = []
    i = 0
    in_str = False
    str_char = ''
    
    while i < len(text):
        char = text[i]
        
        if in_str:
            if char == '\\':
                clean_text.append(' ')
                clean_text.append(' ')
                i += 2
                continue
            if char == str_char:
                in_str = False
            clean_text.append(' ')
            i += 1
            continue
            
        if char in ('"', "'", "`"):
            in_str = True
            str_char = char
            clean_text.append(' ')
            i += 1
            continue
            
        # Simplified regex literal ignore: if we see / and the previous non-space char was =, (, [, {, ;, ,, or a keyword...
        # Let's just not strip regex for now, see if it fails.
        
        clean_text.append(char)
        i += 1
        
    cleaned = ''.join(clean_text)
    
    # Now count brackets
    stack = []
    line_num = 1
    for i, char in enumerate(cleaned):
        if char == '\n':
            line_num += 1
        elif char in '{[(':
            stack.append((char, line_num))
        elif char in '}])':
            if not stack:
                print(f"Extra closing {char} at line {line_num}")
                continue
            last_char, last_line = stack.pop()
            expected = {'}':'{', ']':'[', ')':'('}[char]
            if last_char != expected:
                print(f"Mismatch at line {line_num}: found {char}, expected match for {last_char} from line {last_line}")
                # We won't crash, let's keep going to find all errors
                
    if stack:
        print("Unclosed brackets:")
        for char, line in stack[-20:]:
            print(f"  {char} from line {line}")
    else:
        print("All brackets balanced!")

find_mismatch('app.js')
