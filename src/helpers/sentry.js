const Sentry = require('@sentry/node');

function sendToSentry(e) {
    try {
        if (!process.env.ENABLE_SENTRY) return;
        if (!e) {
            sendToSentry('Error al generar excepción.');
        }
        Sentry.captureException(e);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    sendToSentry
}
