import json

notebook_path = 'ai_interview_coach.ipynb'

try:
    with open(notebook_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Fix: Remove the 'widgets' key from metadata if it exists
    if 'metadata' in data and 'widgets' in data['metadata']:
        print("Found 'widgets' in metadata. Removing it...")
        del data['metadata']['widgets']
        
        with open(notebook_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Notebook fixed successfully!")
    else:
        print("No 'widgets' found in metadata. File might already be clean.")

except Exception as e:
    print(f"Error: {e}")
