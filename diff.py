import difflib

def compare_files():
    with open('backup.js', 'r', encoding='utf-8') as f1, open('app.js', 'r', encoding='utf-8') as f2:
        diff = difflib.unified_diff(
            f1.readlines(), 
            f2.readlines(), 
            fromfile='backup.js', 
            tofile='app.js'
        )
    
    with open('diff.txt', 'w', encoding='utf-8') as out:
        out.writelines(diff)
        
compare_files()
