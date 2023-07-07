import sys
from deep_translator import GoogleTranslator

txt = sys.argv[1]
source = sys.argv[2]
target = sys.argv[3]

translated = GoogleTranslator(source=source, target=target).translate(txt)
print(translated)