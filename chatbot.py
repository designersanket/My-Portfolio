import json
import random
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load knowledge base
BASE_DIR = Path(__file__).resolve().parent
with open(BASE_DIR / 'knowledge_base.json', 'r', encoding='utf-8') as file:
    knowledge_base = json.load(file)

# Prepare training data
corpus = []
tags = []
for intent in knowledge_base['intents']:
    for pattern in intent.get('patterns', []):
        corpus.append(pattern)
        tags.append(intent['tag'])

# Initialize and train TF-IDF Vectorizer
vectorizer = TfidfVectorizer(lowercase=True, stop_words='english')
# If the corpus is empty (shouldn't be, but just in case), handle it
if corpus:
    X = vectorizer.fit_transform(corpus)
else:
    X = None

def get_response(user_input):
    if not corpus or X is None:
        return "My knowledge base is empty."

    # Vectorize user input
    user_vec = vectorizer.transform([user_input])
    
    # Calculate cosine similarity between user input and all patterns
    similarities = cosine_similarity(user_vec, X)
    
    # Find the best match
    best_match_idx = np.argmax(similarities)
    best_match_score = similarities[0, best_match_idx]
    
    # Set a threshold for similarity to avoid completely irrelevant answers
    if best_match_score > 0.2:
        best_tag = tags[best_match_idx]
        for intent in knowledge_base['intents']:
            if intent['tag'] == best_tag:
                return random.choice(intent['responses'])
    
    # Fallback response
    for intent in knowledge_base['intents']:
        if intent['tag'] == 'fallback':
            return random.choice(intent['responses'])
            
    return "I don't know that yet — I'll update my memory if you tell me."
