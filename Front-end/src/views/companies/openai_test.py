import openai
import os


openai.api_key = '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'


def test_openai(string):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": string}]
    )
    return completion['choices'][0]['message']['content'].strip()


ret = test_openai(
    "REVSC OPN/PRQ ILIAC ART W/STNT & ANGIOP IPSILATL 的ICD-CM-9手术编码是什么,用中文简单回答")
print(ret)
