const fs = require('fs');
const PDFDocument = require('pdfkit');
const header = require('./header');

// Renders the document. Returns a promise.

module.exports = (blocks, config, out) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            bufferPages: true,
            margins: {
                top: config.MarginTop(),
                left: config.MarginLeft(),
                bottom: config.MarginBottom(),
                right: config.MarginRight()
            },
            size: config.Size()
        });
        const piped = doc.pipe(
            fs.createWriteStream(out));
        // Metadata.
        doc.info.Title = config.Title();
        doc.info.Author = config.Author();
        // Add content blocks.
        for (const block of blocks) {
            block.toDoc(doc, config);
        }
        // Add header.
        header(doc, config);
        doc.flushPages();
        doc.end();
        // Resolve/reject.
        piped.on('error', (err) => {
            reject(err);
        });
        piped.on('close', () => {
            resolve();
        });
    });
};
