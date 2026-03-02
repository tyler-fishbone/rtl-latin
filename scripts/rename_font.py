from pathlib import Path

from fontTools.ttLib import TTFont


SOURCE_FILES = [
    Path("public/fonts/RTLLatin-Regular.otf"),
    Path("public/fonts/RTLLatin-Regular.woff2"),
]

REPLACEMENTS = {
    1: "RTL Latin",
    3: "RTL Latin Regular; Mirrored Latin derived from Inter",
    4: "RTL Latin Regular",
    6: "RTLLatin-Regular",
    16: "RTL Latin",
    17: "Regular",
}

OUTPUT_NAMES = {
    ".otf": Path("public/fonts/RTLLatin-Regular.otf"),
    ".woff2": Path("public/fonts/RTLLatin-Regular.woff2"),
}


def update_font(path: Path) -> None:
    font = TTFont(path)

    for record in font["name"].names:
        replacement = REPLACEMENTS.get(record.nameID)
        if replacement is None:
            continue
        record.string = replacement.encode(record.getEncoding())

    output_path = OUTPUT_NAMES[path.suffix]
    font.save(output_path)
    print(f"wrote {output_path}")


def main() -> None:
    for source in SOURCE_FILES:
        update_font(source)


if __name__ == "__main__":
    main()
