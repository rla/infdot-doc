// Adds header with page number and
// branding info.

module.exports = (doc, config) => {
    const start = 1;
    const pages = doc.bufferedPageRange();
    const total = pages.start + pages.count;
    for (var i = start; i < total; i++) {
        doc.switchToPage(i);
        doc.fillColor('#666666');
        doc.strokeColor('#666666');
        doc.font('Times-Roman');
        doc.text(`${i + 1}/${total}`, config.MarginLeft(), 30);
        doc.text(config.Header(), doc.page.width - 340 - config.MarginRight(),
            30, { width: 340, align: 'right' });
        doc.moveTo(config.MarginLeft(), 50).lineTo(
            doc.page.width - config.MarginRight(), 50).stroke();
    }
};
