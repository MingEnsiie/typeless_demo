import argparse
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import torch
from qwen_asr import Qwen3ASRModel


def convert_to_wav(input_path: Path) -> Path:
    output = Path(tempfile.mkstemp(suffix=".wav")[1])
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(input_path),
            "-ac",
            "1",
            "-ar",
            "16000",
            str(output),
        ],
        check=True,
    )
    return output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--audio", required=True)
    parser.add_argument("--language", default=None)
    args = parser.parse_args()

    started = time.time()
    audio_path = Path(args.audio)
    wav_path = convert_to_wav(audio_path)
    model = Qwen3ASRModel.from_pretrained(
        args.model_path,
        dtype=torch.bfloat16,
        device_map="cuda:0" if torch.cuda.is_available() else "cpu",
        max_inference_batch_size=1,
        max_new_tokens=256,
    )
    results = model.transcribe(audio=str(wav_path), language=args.language)
    result = results[0]
    print(
        json.dumps(
            {
                "text": result.text,
                "language": result.language,
                "duration_ms": int((time.time() - started) * 1000),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
