from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import os

# Increase timeout for downloading models
os.environ['HF_HUB_DOWNLOAD_TIMEOUT'] = '300'  # 5 minutes

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# Global variables for model
model = None
tokenizer = None
pipe = None


def load_model():
    """Load the model on startup"""
    global model, tokenizer, pipe

    print("Loading model...")
    try:
        print("Step 1: Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("minimaxir/magic-the-gathering")
        print("✓ Tokenizer loaded")

        print("Step 2: Loading model (this may take several minutes)...")
        model = AutoModelForCausalLM.from_pretrained("minimaxir/magic-the-gathering")
        print("✓ Model loaded")

        print("Step 3: Creating pipeline...")
        pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
        print("✓ Pipeline created")

        print("Model loaded successfully!")
    except Exception as e:
        print(f"ERROR loading model: {e}")
        import traceback
        traceback.print_exc()
        raise


@app.route('/generate', methods=['POST'])
def generate_cards():
    """Generate MTG cards based on prompt"""
    try:
        data = request.json
        prompt = data.get('prompt', 'red')
        num_cards = data.get('num_cards', 5)
        temperature = data.get('temperature', 0.8)
        max_length = data.get('max_length', 100)

        print(f"Generating {num_cards} cards with prompt: '{prompt}'")

        if pipe is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded yet'
            }), 503

        # Generate cards using the pipeline
        results = pipe(
            prompt,
            max_length=max_length,
            num_return_sequences=num_cards,
            temperature=temperature,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            truncation=True
        )

        # Extract generated text
        cards = [result['generated_text'] for result in results]

        return jsonify({
            'success': True,
            'cards': cards,
            'prompt': prompt,
            'num_cards': len(cards)
        })

    except Exception as e:
        print(f"Error generating cards: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': pipe is not None
    })


@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'MTG Card Generator API',
        'endpoints': {
            '/generate': 'POST - Generate cards',
            '/health': 'GET - Health check'
        }
    })

# hi i did something
if __name__ == '__main__':
    try:
        print("Starting MTG Card Generator API...")

        # Load model first
        load_model()

        # Run Flask app
        print("\n" + "=" * 60)
        print("🚀 MTG Card Generator API Running!")
        print("=" * 60)
        print(f"📡 Local URL: http://localhost:5000")
        print(f"📡 API Endpoint: http://localhost:5000/generate")
        print(f"💚 Health Check: http://localhost:5000/health")
        print("=" * 60 + "\n")

        app.run(host='0.0.0.0', port=5000, debug=False)

    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback

        traceback.print_exc()
        print("\nServer failed to start. Check the error above.")
