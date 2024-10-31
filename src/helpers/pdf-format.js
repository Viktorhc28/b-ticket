const path = require('path');

var fonts = {
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    Roboto: {
        normal: path.join(__dirname, './../assets/fonts/Roboto/Roboto-Regular.ttf'),
        bold: path.join(__dirname, './../assets/fonts/Roboto/Roboto-Medium.ttf'),
        italics: path.join(__dirname, './../assets/fonts/Roboto/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, './../assets/fonts/Roboto/Roboto-MediumItalic.ttf'),
    }
};

var styles = {
    bold: {
        bold: true
    },
    italic: {
        italic: true
    },
    header: {
        fontSize: 28,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 0],
        decoration: 'underline',
        tocItem: true
    },
    header2: {
        fontSize: 20,
        bold: true,
        tocItem: true
    },
    header3: {
        fontSize: 16,
        bold: true,
        tocItem: true
    },
    subheader: {
        fontSize: 14
    },
    superMargin: {
        margin: [20, 0, 40, 0],
        fontSize: 15
    },
    center: {
        alignment: 'center'
    },
    right: {
        alignment: 'right'
    },
    firma: {
        alignment: 'center',
        margin: [0, 40, 0, 0],
    },
    empty: {
        margin: [0, 80, 0, 0],
    },
    saltoLinea: {
        margin: [0, 16, 0, 0],
    },
    medioSaltoLinea: {
        margin: [0, 10, 0, 0],
    },
    important: {
        fontSize: 16,
        bold: true
    },
}

var size80mm = {
    width: 210,
    height: 'auto'
};

var size56mm = {
    width: 147,
    height: 'auto'
};

module.exports = {
    fonts,
    styles,
    size80mm,
    size56mm
}