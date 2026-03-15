
import sys
import json
import re
import random
import os

# Load training data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, "training_data.json"), "r") as f:
    DATA = json.load(f)

WEAK_VERBS = DATA["weak_verbs"]
FILLERS    = DATA["filler_words"]
INFORMAL   = DATA["informal_to_formal"]
METRICS    = DATA["metric_suggestions"]
DOMAIN_KW  = DATA["domain_keywords"]

def detect_domain(text):
    text_lower = text.lower()
    for domain, keywords in DOMAIN_KW.items():
        if any(kw in text_lower for kw in keywords):
            return domain
    return "general"

def replace_informal(text):
    for informal, formal in INFORMAL.items():
        text = re.sub(re.escape(informal), formal, text, flags=re.IGNORECASE)
    return text

def remove_fillers(text):
    for filler in FILLERS:
        text = re.sub(r'\b' + re.escape(filler) + r'\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def upgrade_weak_verbs(text):
    words = text.split()
    if not words:
        return text
    first_word = words[0].lower()
    if first_word in WEAK_VERBS:
        strong = random.choice(WEAK_VERBS[first_word])
        words[0] = strong.capitalize()
        text = ' '.join(words)
    for weak, strong_list in WEAK_VERBS.items():
        if ' ' in weak:
            strong = random.choice(strong_list)
            text = re.sub(r'\b' + re.escape(weak) + r'\b', strong, text, flags=re.IGNORECASE)
    return text

def fix_punctuation(text):
    text = text.strip()
    if text and text[-1] not in '.!?':
        text += '.'
    if text:
        text = text[0].upper() + text[1:]
    return text

def get_metric_tip(text):
    if not re.search(r'\d+', text):
        return random.choice(METRICS)
    return None

def enhance_text(text, context="Experience"):
    if not text or len(text.strip()) < 5:
        return {"success": False, "error": "Text too short. Please provide more detail."}

    original = text.strip()
    enhanced = replace_informal(original)
    enhanced = remove_fillers(enhanced)
    enhanced = upgrade_weak_verbs(enhanced)
    enhanced = fix_punctuation(enhanced)

    return {
        "success":    True,
        "original":   original,
        "enhanced":   enhanced,
        "domain":     detect_domain(enhanced),
        "metric_tip": get_metric_tip(enhanced),
        "context":    context
    }

if __name__ == "__main__":
    try:
        # Read from stdin instead of argv (fixes Windows quote issues)
        raw        = sys.stdin.read()
        input_data = json.loads(raw)
        text       = input_data.get("text", "")
        context    = input_data.get("context", "Experience")
        result     = enhance_text(text, context)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error":   str(e)
        }))