import argparse
import json
import re
import time
from pathlib import Path

from vllm import LLM, SamplingParams


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--request", required=True)
    parser.add_argument("--gpu-memory-utilization", type=float, default=0.55)
    parser.add_argument("--max-model-len", type=int, default=4096)
    args = parser.parse_args()

    request = json.loads(Path(args.request).read_text(encoding="utf-8"))
    messages = request.get("messages") or []
    if not messages:
        raise ValueError("messages is required")

    started = time.time()
    llm = LLM(
        model=args.model_path,
        trust_remote_code=True,
        max_model_len=args.max_model_len,
        gpu_memory_utilization=args.gpu_memory_utilization,
    )
    sampling = SamplingParams(
        max_tokens=int(request.get("max_tokens") or 1024),
        temperature=float(request.get("temperature") if request.get("temperature") is not None else 0.2),
        top_p=float(request.get("top_p") if request.get("top_p") is not None else 0.95),
    )
    output = llm.chat([messages], sampling_params=sampling)[0].outputs[0].text
    output = strip_thinking(output).strip()
    response = {
        "id": f"chatcmpl-local-{int(time.time() * 1000)}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": "Qwen3.5-4B",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": output},
                "finish_reason": "stop",
            }
        ],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
        "duration_ms": int((time.time() - started) * 1000),
    }
    print(json.dumps(response, ensure_ascii=False))
    return 0


def strip_thinking(text: str) -> str:
    stripped = re.sub(r"(?s)<think>.*?</think>", "", text)
    if stripped != text:
        return stripped
    marker = "\n</think>\n"
    if marker in text:
        return text.split(marker, 1)[1]
    final_markers = [
        "Final Output Generation:",
        "Final Response:",
        "Final Answer:",
        "Answer:",
    ]
    for marker in final_markers:
        if marker in text:
            candidate = text.rsplit(marker, 1)[1].strip()
            if candidate:
                return candidate
    if text.lstrip().startswith("Thinking Process:"):
        sections = [section.strip() for section in re.split(r"\n\s*\n", text) if section.strip()]
        non_reasoning = [
            section
            for section in sections
            if not re.match(r"^(Thinking Process|\\d+\\.|[*\\-]\\s+|[A-Z][^:]{0,80}:)", section)
        ]
        if non_reasoning:
            return non_reasoning[-1]
    return text


if __name__ == "__main__":
    raise SystemExit(main())
