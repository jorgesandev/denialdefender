# DenialDefender: End-to-End Data Pipeline

This document traces a single user request from initial PDF upload to the final generated appeal letter, detailing the transformations and retrieval steps.

## 1. Intake & Multimodal Processing

When a user uploads a file via the Next.js frontend:
1. **Frontend**: The `DemoSection` component sends a `multipart/form-data` request containing the file and any optional `chart_text` to the `/api/generate` endpoint.
2. **Backend (`ingest.py`)**: 
   - The system first attempts a digital extraction using `pdfplumber`. 
   - If no text is found (e.g., a scanned image), it invokes the **Qwen2.5-VL-7B** model.
   - The model "looks" at the document and returns a structured markdown representation of the denial letter.

## 2. The Four-Pillar Retrieval (RAG)

Once the denial text is extracted, the `retrieval.py` module executes four parallel retrieval tasks to gather context:

| Pillar | Input | Source | Output |
|---|---|---|---|
| **Patient Context** | Denial reason + chart_text | Synthetic Clinical Records | Relevant lab results, vitals, and encounter snippets. |
| **Payer Policy** | Denial Code (e.g., J3490) | `payer_policies.json` | The specific coverage criteria the payer used to justify the denial. |
| **Past Appeals** | Payer + Denial Code | `past_appeals.json` | High-performing rhetorical patterns from previous successful appeals. |
| **Medical Literature** | Medical Condition | `data/literature/` | Peer-reviewed citations to provide "Clinical Authority." |

## 3. Prompt Engineering & Context Assembly

The `prompts.py` module acts as the "Architect." It takes the raw retrieved data and assembles a professional context window:

```text
SYSTEM PROMPT: You are a senior Medical Necessity Specialist...
DENIAL DATA: <extracted text>
PATIENT CONTEXT: <clinical spans>
POLICY CRITERIA: <payer rules>
LITERATURE: <citations>
FEW-SHOT EXAMPLES: <winning patterns>
```

The resulting prompt is often **20,000 to 50,000 tokens** long, ensuring the LLM has every piece of evidence needed to write a defensible letter.

## 4. Reasoning & Generation

The final prompt is sent to the **Qwen2.5-32B-Instruct** model on the MI300X.
- **Thinking Process**: The model analyzes the contradictions between the Patient Context and the Payer Policy.
- **Drafting**: It writes a formal letter addressed to the insurance company's medical director.
- **Streaming**: The response is streamed back to the FastAPI orchestrator, which then streams it to the Next.js frontend in real-time.

## 5. Review & Output

The frontend renders the markdown output in a dedicated "Review Panel." The billing specialist can then:
- Copy the letter to their clipboard.
- Verify the citations against the provided evidence.
- Download the final appeal packet for submission.

---
This pipeline is designed for **latency-sensitivity** and **clinical accuracy**, ensuring that the "Human-in-the-loop" always has a high-quality draft to start from.
