import requests
import json

# 1. Paths to your specific test case
case_folder = "../data/synthetic/denials/001_lack_of_medical_necessity"
pdf_path = f"{case_folder}/denial_letter.pdf"
chart_path = f"{case_folder}/patient_chart.md"

print(f"Loading chart data from: {chart_path}")
with open(chart_path, "r") as f:
    chart_text = f.read()

# 2. Set up the multipart/form-data payload
url = "http://localhost:9000/api/generate"
files = {
    "denial_pdf": ("denial_letter.pdf", open(pdf_path, "rb"), "application/pdf")
}
data = {
    "chart_text": chart_text
}

# 3. Fire the request at your dual-model architecture
print("\nSending payload to MI300X... (Waiting for Vision & Language models to process)")
response = requests.post(url, files=files, data=data)

# 4. Print the glorious results
if response.status_code == 200:
    result = response.json()
    
    # NEW: Catch and print the hidden error!
    if result.get("status") == "error":
        print("\n🚨 PIPELINE ERROR CAUGHT:")
        print(result.get("message"))
    else:
        print("\n" + "="*50)
        print("🏥 STRUCTURED DENIAL DATA (from ingest.py):")
        print("="*50)
        print(json.dumps(result.get("denial", {}), indent=2))
        
        print("\n" + "="*50)
        print("⚖️ GENERATED APPEAL (Qwen3-32B):")
        print("="*50)
        print(result.get("appeal", ""))
        
        print("\n" + "="*50)
        print("📊 PIPELINE METRICS:")
        print("="*50)
        print(f"Time Elapsed: {result.get('elapsed_seconds')}s")
        print(f"Was Scanned: {result.get('was_scanned')}")
        print(f"Models Used: {result.get('models_used')}")
else:
    print(f"Error {response.status_code}: {response.text}")