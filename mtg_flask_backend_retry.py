# mtg_flask_backend_retry.py
# Flask backend for MTG card generation
# Usage:
#   pip install flask flask-cors transformers torch
#   python mtg_flask_backend_retry.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import os
import re
import traceback

# Increase Hugging Face download timeout for slow networks
os.environ['HF_HUB_DOWNLOAD_TIMEOUT'] = '300'  # seconds

app = Flask(__name__)
CORS(app)

# Globals
model = None
tokenizer = None
pipe = None

def load_model():
    """Load tokenizer, model and create a text-generation pipeline."""
    global model, tokenizer, pipe
    try:
        print("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("minimaxir/magic-the-gathering")
        print("Tokenizer loaded.")
        
        print("Loading model...")
        model = AutoModelForCausalLM.from_pretrained("minimaxir/magic-the-gathering")
        print("Model loaded.")
        
        print("Creating pipeline...")
        pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
        print("Pipeline created successfully.")
    except Exception as e:
        print("Error loading model:")
        traceback.print_exc()
        raise

def format_prompt(name_or_theme: str, mana_cost: str = "", type_line: str = "") -> str:
    """
    Construct a schema-based prompt the model was trained on.
    Example: <|name|>Blazing Drake<|manaCost|>{3}{R}{R}<|type|>Creature - Dragon<|text|>
    """
    name = name_or_theme.strip() or "Unnamed"
    mana = mana_cost.strip()
    type_val = type_line.strip() or "Creature"

    prompt = f"<|name|>{name}<|manaCost|>{mana}<|type|>{type_val}<|text|>"
    return prompt

def parse_card(raw_output: str) -> dict:
    """Parse model text into a structured MTG card dictionary."""
    text = raw_output.replace("\n", " ").strip()
    pattern = r"<\|([^|]+)\|>([^<]*)"
    matches = re.findall(pattern, text)

    card = {}
    for field, value in matches:
        key = field.strip()
        val = value.strip()
        if val:
            val = re.sub(r"\s+", " ", val)
            card[key] = val

    # Apply safer defaults for missing fields
    card.setdefault('name', 'Unnamed')
    card.setdefault('manaCost', '')
    card.setdefault('type', 'Unknown')
    card.setdefault('text', '')
    card.setdefault('power', '')
    card.setdefault('toughness', '')

    # Clean up common issues
    if card['name'].startswith('{'):
        # Name looks like mana cost - swap if manaCost is empty
        if not card['manaCost']:
            card['manaCost'] = card['name']
            card['name'] = 'Unnamed'

    return card

@app.route('/generate', methods=['POST'])
def generate_cards():
    try:
        if pipe is None:
            return jsonify(success=False, error="Model not loaded yet"), 503

        data = request.get_json(force=True) or {}
        user_prompt = data.get('prompt', '').strip()
        num_cards = int(data.get('num_cards', 1))
        temperature = float(data.get('temperature', 0.8))
        max_length = int(data.get('max_length', 200))
        mana_cost = data.get('mana_cost', '').strip()
        type_line = data.get('type_line', '').strip()

        # Validation
        if not user_prompt:
            return jsonify(success=False, error="Prompt cannot be empty"), 400

        # Safety clamps
        num_cards = max(1, min(10, num_cards))
        max_length = max(50, min(400, max_length))
        temperature = max(0.0, min(2.0, temperature))

        print(f"[generate] prompt='{user_prompt}', num={num_cards}, temp={temperature}, max_length={max_length}")

        # Build formatted prompt
        formatted_prompt = format_prompt(user_prompt, mana_cost, type_line)

        # Generate with pipeline
        results = pipe(
            formatted_prompt,
            max_length=max_length,
            num_return_sequences=num_cards,
            temperature=temperature,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            truncation=True
        )

        # Parse each result
        cards = []
        for res in results:
            raw = res.get('generated_text', '')
            parsed = parse_card(raw)
            
            # Fallback: use prompt as name if parsing failed
            if not parsed.get('name') or parsed['name'] == 'Unnamed':
                parsed['name'] = user_prompt
            
            # Attach raw for debugging
            parsed['_raw'] = raw
            cards.append(parsed)

        return jsonify(
            success=True, 
            cards=cards, 
            prompt=formatted_prompt, 
            num_cards=len(cards)
        )

    except ValueError as e:
        return jsonify(success=False, error=f"Invalid input: {str(e)}"), 400
    except Exception as e:
        print("Error in /generate:")
        traceback.print_exc()
        return jsonify(success=False, error=f"Server error: {str(e)}"), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify(
        status='ok', 
        model_loaded=(pipe is not None),
        endpoints=['/generate', '/health', '/']
    )

@app.route('/', methods=['GET'])
def home():
    return jsonify(
        message='MTG Card Generator API',
        version='1.0',
        endpoints={
            '/': 'This help message',
            '/health': 'Check if model is loaded',
            '/generate': 'POST to generate cards'
        }
    )

if __name__ == '__main__':
    try:
        print("="*50)
        print("Starting MTG Flask backend...")
        print("="*50)
        load_model()
        print("="*50)
        print("✓ Model loaded successfully!")
        print("✓ Server starting at http://localhost:5000")
        print("="*50)
        app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        print("="*50)
        print("✗ Fatal error starting server:")
        print("="*50)
        traceback.print_exc()