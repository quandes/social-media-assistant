from keybert import KeyBERT
import sys
import json

arg = sys.argv[1]
top_n = int(sys.argv[2])
min_kw_length = int(sys.argv[3])
max_kw_length = int(sys.argv[4])
diversity = float(sys.argv[5])

kw_model = KeyBERT()
keywords = kw_model.extract_keywords(arg,keyphrase_ngram_range=(min_kw_length, max_kw_length), stop_words="english", use_mmr=True, top_n=top_n, diversity= diversity)

print(json.dumps(keywords))