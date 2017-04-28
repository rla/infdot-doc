const path = require('path');
const assert = require('assert');

class Line {
    constructor(type, text) {
        assert.equal(typeof type, 'string');
        assert.equal(typeof text, 'string');
        this.type = type;
        this.text = text;
    }
}

class Text {
    constructor(lines) {
        assert.ok(Array.isArray(lines));
        this.lines = lines;
    }
    toDoc(doc, config) {
        doc.font('Times-Roman');
        const text = this.lines.map(
            line => line.text).join(' ');
        doc.fontSize(config.FontSize());
        doc.moveDown();
        doc.text(text, {
            align: 'justify',
            indent: 0,
            paragraphGap: 0,
            lineGap: 3
        });
    }
}

class List {
    constructor(lines) {
        assert.ok(Array.isArray(lines));
        this.lines = lines;
    }
    toDoc(doc, config) {
        doc.font('Times-Roman');
        doc.fontSize(config.FontSize());
        doc.moveDown();
        doc.list(this.lines.map(line => line.text), {
            lineGap: 3
        });
    }
}

class Title {
    constructor(lines) {
        assert.equal(lines.length, 1);
        const text = lines[0].text;
        const match = text.match(/^(#+)([^#]+)$/);
        this.text = match[2].trim();
        this.level = match[1].length;
    }
    toDoc(doc, config) {
        const fontSize = config.TitleFontSize() - 4 * (this.level - 1);
        doc.font('Times-Bold');
        doc.fontSize(fontSize);
        doc.moveDown(0.5);
        doc.text(this.text);
        doc.moveDown(0.5);
    }
}

class Page {
    toDoc(doc) {
        doc.addPage();
    }
}

class Image {
    constructor(lines) {
        assert.equal(lines.length, 1);
        this.file = lines[0].text;
    }
    toDoc(doc, config) {
        doc.fontSize(config.FontSize());
        doc.moveDown();
        doc.image(path.resolve(config.Directory(), this.file), {
            width: doc.page.width - 2 * 72
        });
    }
}

class Config {
    constructor(lines) {
        this.configData = {};
        for (const line of lines) {
            const match = line.text.match(/^(\w+):\s*(.+)$/);
            assert.ok(match);
            this.configData[match[1]] = match[2];
        }
    }
    toDoc() {}
}

const PATTERNS = [
    {
        regex: /^\s*\*(.+)$/,
        value: match => new Line('item', match[1].trim())
    },
    {
        regex: /^\s*(#+[^#]+)$/,
        value: match => new Line('title', match[1].trim())
    },
    {
        regex: /^---/,
        value: match => new Line('page', '')
    },
    {
        regex: /^\s*\!\[([^\]]+)\]\(([^\)]+)\)$/,
        value: match => new Line('image', match[2].trim())
    },
    {
        regex: /^\s*\<\!\-\-\s*(\w+:\s*.+)\-\-\>/,
        value: match => new Line('config', match[1])
    },
    {
        regex: /^\s*$/,
        value: match => new Line('empty', '')
    },
    {
        regex: /^(.+)$/,
        value: match => new Line('normal', match[1].trim())
    }
];

// Parses single line.

const parseLine = (text) => {
    for (const pattern of PATTERNS) {
        const match = text.match(pattern.regex);
        if (match) {
            return pattern.value(match);
        }
    }
    throw new Error(`Uknown line: ${text}.`);
};

// Parses block of lines.

const block = (lines) => {
    assert.ok(Array.isArray(lines));
    assert.ok(lines.length > 0);
    const type = lines[0].type;
    if (type === 'normal') {
        return new Text(lines);
    } else if (type === 'item') {
        return new List(lines);
    } else if (type === 'title') {
        return new Title(lines);
    } else if (type === 'page') {
        return new Page();
    } else if (type === 'image') {
        return new Image(lines);
    } else if (type === 'config') {
        return new Config(lines);
    } else {
        throw new Error(`Unknown line type: ${type}.`);
    }
};

// Parses text into blocks.

module.exports = (text) => {
    assert.equal(typeof text, 'string');
    const blocks = [];
    let buffer = []; // of parsed lines
    let last = null;
    for (const line of text.split(/\r?\n/)) {
        const parsed = parseLine(line);
        if (parsed.type === 'empty') {
            if (buffer.length > 0) {
                // Empty line ends current block.
                blocks.push(block(buffer));
                buffer = [];
            }            
        } else {
            // Might end previous block.
            if (last && last.type !== parsed.type && buffer.length > 0) {
                blocks.push(block(buffer));
                buffer = [];
            }
            buffer.push(parsed);
        }
        last = parsed;
    }
    // Might have something left in buffer.
    if (buffer.length > 0) {
        blocks.push(block(buffer));
    }
    return blocks;
};

