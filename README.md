# infdot-doc

A personal project to evaluate [PDFKit][pdfkit]. It contains a
very small Markdown subset to enter headings, paragraph blocks,
bulleted lists and images. Document options are configured with
HTML comments.

[pdfkit]:http://pdfkit.org/

## Usage

```
infdot-doc -i doc.md -o doc.pdf
```

## Installation

```
npm install git+https://github.com/rla/infdot-doc.git -g
```

## Markdown subset

Paragraphs are blocks continuous text. Line ends do not matter.

Headings:

```
# Heading level 1
## Heading level 2
```

Bulleted list (single level):

```
* Item 1
* Item 2
* Item 3
```

Image (scaled to full width):

```
![description](screenshot.png)
```

Description does not appear anywhere but is useful for writing.

Forced page break:

```
---
```

### Document settings

Document setting are specified using the HTML comment syntax:

```
<!-- Size: A4 -->
```

Available options are:

 * Size - page [size][sizes];
 * FontSize - font size in units (default 12);
 * TitleFontSize - heading font size (default 25);
 * Author - document author name;
 * Header - text displayed in the header.
 * MarginTop - page top margin (default 98);
 * MarginLeft - page left margin (default 72);
 * MarginBottom - page bottom margin (default 72);
 * MarginRight - page right margin (default 72).

[sizes]:https://github.com/devongovett/pdfkit/blob/b13423bf0a391ed1c33a2e277bc06c00cabd6bf9/lib/page.coffee#L72

## License

If you would like to use some code from here then do so under the terms of the MIT license.
