// Extracts document configuration from the
// parsed form.

class Settings {
    constructor(data) { this.data = data; }
    FontSize() { return this.data.FontSize; }
    TitleFontSize() { return this.data.TitleFontSize; }
    Author() { return this.data.Author; }
    Header() { return this.data.Header; }
    MarginTop() { return this.data.MarginTop; }
    MarginLeft() { return this.data.MarginLeft; }
    MarginBottom() { return this.data.MarginBottom; }
    MarginRight() { return this.data.MarginRight; }
    Title() { return this.data.Title; }
    Size() { return this.data.Size; }
    Directory() { return this.directory; }
    setDirectory(directory) { this.directory = directory; }
}

exports.extract = (blocks) => {
    const config = {
        FontSize: 14,
        TitleFontSize: 25,
        Author: 'Unknown author',
        Header: '',
        MarginTop: 98,
        MarginLeft: 72,
        MarginBottom: 72,
        MarginRight: 72,
        Title: 'Untitled',
        Size: 'A4'
    };
    for (const block of blocks) {
        if (block.configData) {
            for (const key of Object.keys(block.configData)) {
                updateEntry(config, key, block.configData[key]);
            }
        }
        if (block.hasOwnProperty('text') && block.hasOwnProperty('level')) {
            if (block.level === 1) {
                config.Title = block.text;
            }
        }
    }
    return new Settings(config);
};

const NUMERICAL_SETTINGS = [
    'FontSize',
    'TitleFontSize',
    'MarginTop',
    'MarginLeft',
    'MarginBottom',
    'MarginRight'
];

const updateEntry = (config, key, value) => {
    if (!config.hasOwnProperty(key)) {
        throw new Error(`There is no setting ${key}.`);
    }
    if (NUMERICAL_SETTINGS.indexOf(key) >= 0) {
        const number = parseFloat(value);
        if (isNaN(number)) {
            throw new Error(`Setting ${key} must have a numerical value.`);
        }
        config[key] = number;
    } else {
        config[key] = value.trim();
    }
};
