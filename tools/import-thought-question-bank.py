"""Convert Word-exported question-bank .docx files into a Stellar wiki."""

from __future__ import annotations

import argparse
import html
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
WIKI_ID = "xi-thought-question-bank"
W_NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

CHAPTERS = [
    ("导论 练习题.docx", "00-introduction", "导论"),
    ("第一章 新时代坚持和发展中国特色社会主义.docx", "01-new-era-socialism", "第一章 · 新时代坚持和发展中国特色社会主义"),
    ("第二章 以中国式现代化全面推进中华民族伟大复兴.docx", "02-chinese-modernization", "第二章 · 以中国式现代化全面推进中华民族伟大复兴"),
    ("第三章 坚持党的全面领导.docx", "03-party-leadership", "第三章 · 坚持党的全面领导"),
    ("第四章 坚持以人民为中心.docx", "04-people-centered", "第四章 · 坚持以人民为中心"),
    ("第五章 全面深化改革.docx", "05-deepening-reform", "第五章 · 全面深化改革"),
    ("第六章 推动高质量发展.docx", "06-high-quality-development", "第六章 · 推动高质量发展"),
    ("第七章 社会主义现代化建设的教育、科技、人才战略.docx", "07-education-science-talent", "第七章 · 教育、科技、人才战略"),
    ("第八章 发展全过程人民民主.docx", "08-whole-process-democracy", "第八章 · 发展全过程人民民主"),
    ("第九章 全面依法治国.docx", "09-rule-of-law", "第九章 · 全面依法治国"),
    ("第十章 建设社会主义文化强国.docx", "10-cultural-power", "第十章 · 建设社会主义文化强国"),
    ("第十一章 以保障和改善民生为重点加强社会建设.docx", "11-peoples-livelihood", "第十一章 · 加强社会建设"),
    ("第十二章 建设社会主义生态文明.docx", "12-ecological-civilization", "第十二章 · 建设社会主义生态文明"),
    ("第十三章 维护和塑造国家安全.docx", "13-national-security", "第十三章 · 维护和塑造国家安全"),
    ("第十四章 建设巩固国防和强大人民军队.docx", "14-national-defense", "第十四章 · 建设巩固国防和强大人民军队"),
    ("第十五章 坚持“一国两制”和推进祖国统一.docx", "15-one-country-two-systems", "第十五章 · 坚持“一国两制”和推进祖国统一"),
    ("第十六章 中国特色大国外交和推动构建人类命运共同体.docx", "16-major-country-diplomacy", "第十六章 · 中国特色大国外交"),
    ("第十七章 全面从严治党.docx", "17-party-self-governance", "第十七章 · 全面从严治党"),
]


def paragraphs(docx: Path) -> list[str]:
    with zipfile.ZipFile(docx) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))
    body = root.find("w:body", W_NS)
    if body is None:
        return []
    result: list[str] = []
    for node in body:
        text = "".join(part.text or "" for part in node.findall(".//w:t", W_NS))
        text = re.sub(r"[\u00a0\u3000]+", " ", text).strip()
        if text:
            result.append(text)
    return result


def split_options(text: str) -> list[tuple[str, str]]:
    matches = list(re.finditer(r"(?<![A-Za-z])([A-H])[.．、]\s*", text))
    options: list[tuple[str, str]] = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        options.append((match.group(1), text[match.end():end].strip()))
    return options


def render_body(lines: list[str], title: str) -> str:
    # Word files repeat their title and sometimes a date before the first question section.
    first_section = next((i for i, line in enumerate(lines) if re.match(r"^[一二三四五六七八九十]+、", line)), 0)
    lines = lines[first_section:]
    output = [
        "> 题目与答案按原题库整理；点击“查看答案”展开。原资料中的缺项与表述保持不变。",
        "",
    ]
    answer_parts: list[str] | None = None
    current_section = ""

    def close_answer() -> None:
        nonlocal answer_parts
        if answer_parts is None:
            return
        answer_html = "".join(f"<p>{html.escape(part)}</p>" for part in answer_parts if part)
        output.extend([f'<details class="quiz-answer"><summary>查看答案</summary><div>{answer_html}</div></details>', ""])
        answer_parts = None

    for line_index, line in enumerate(lines):
        if re.match(r"^[一二三四五六七八九十]+、", line):
            close_answer()
            current_section = line
            output.extend([f"## {line}", ""])
            continue

        answer = re.match(r"^(?:答案|答)\s*[：:]\s*(.*)$", line)
        if answer:
            close_answer()
            answer_parts = [answer.group(1).strip()]
            continue

        question = re.match(r"^\d+\s*[.、．]\s*", line)
        if question:
            close_answer()
            output.extend([f'<p class="quiz-question"><strong>{html.escape(line)}</strong></p>', ""])
            continue

        options = split_options(line) if re.match(r"^\s*[A-H][.．、]", line) else []
        if options:
            close_answer()
            for letter, content in options:
                output.append(f"- **{letter}.** {content}")
            next_line = lines[line_index + 1] if line_index + 1 < len(lines) else ""
            if not re.match(r"^\s*[A-H][.．、]", next_line):
                output.append("")
            continue

        if answer_parts is not None:
            answer_parts.append(line)
            continue

        if ("论述题" in current_section or "简答题" in current_section) and line:
            output.extend([f'<p class="quiz-question"><strong>{html.escape(line)}</strong></p>', ""])
        else:
            output.extend([html.escape(line), ""])

    close_answer()
    return "\n".join(output).strip() + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Directory containing converted .docx files")
    args = parser.parse_args()
    source = args.source.resolve()
    destination = ROOT / "source" / "wiki" / WIKI_ID
    destination.mkdir(parents=True, exist_ok=True)

    missing = [name for name, _, _ in CHAPTERS if not (source / name).exists()]
    if missing:
        raise SystemExit("Missing files: " + ", ".join(missing))

    links: list[str] = []
    for filename, slug, title in CHAPTERS:
        body = render_body(paragraphs(source / filename), title)
        front = (
            "---\n"
            f"title: '{title.replace(chr(39), chr(39) * 2)}'\n"
            "layout: page\n"
            f"wiki: {WIKI_ID}\n"
            "menu_id: wiki\n"
            "banner: /assets/snow-mountain-lake.jpg\n"
            "---\n\n"
        )
        (destination / f"{slug}.md").write_text(front + body, encoding="utf-8")
        links.append(f"- [{title}](/wiki/{WIKI_ID}/{slug}/)")

    index = (
        "---\n"
        "title: 习近平新时代中国特色社会主义思想题库\n"
        "layout: page\n"
        f"wiki: {WIKI_ID}\n"
        "menu_id: wiki\n"
        "banner: /assets/snow-mountain-lake.jpg\n"
        "---\n\n"
        "# 章节目录\n\n"
        "导论与第一至第十七章练习题，包含单选题、多选题、填空题、判断题、简答题和论述题。\n\n"
        + "\n".join(links)
        + "\n"
    )
    (destination / "index.md").write_text(index, encoding="utf-8")

    tree_lines = ["  开始:", "    - index"]
    for _, slug, title in CHAPTERS:
        tree_lines.extend([f"  '{title}':", f"    - {slug}"])
    config = (
        "name: 习近平新时代中国特色社会主义思想题库\n"
        "title: 习近平新时代中国特色社会主义思想题库\n"
        "description: 导论与第一至第十七章练习题，答案支持折叠查看。\n"
        "cover: /assets/snow-mountain-lake.jpg\n"
        "tags:\n  - 课程题库\n  - 思政学习\n"
        f"path: /wiki/{WIKI_ID}/\n"
        f"base_dir: wiki/{WIKI_ID}/\n"
        "icon: /assets/avatar.jpg\n"
        "toc: true\n"
        "tree:\n" + "\n".join(tree_lines) + "\n"
    )
    (ROOT / "source" / "_data" / "wiki" / f"{WIKI_ID}.yml").write_text(config, encoding="utf-8")
    print(f"Imported {len(CHAPTERS)} chapters into {destination}")


if __name__ == "__main__":
    main()
