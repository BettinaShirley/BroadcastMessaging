require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let clientReady = false;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false },
});

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR code with your WhatsApp.');
});

client.on('ready', async () => {
    console.log('WhatsApp client is ready!');
    console.log('Waiting 10 seconds to allow you to close dialog boxes...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    clientReady = true;
    console.log('Client is now fully ready.');

    const testNumbers = Object.keys(process.env)
        .filter(key => key.startsWith('PHONE_NUM'))
        .map(key => process.env[key]);

    for (const number of testNumbers) {
        sendMessage(number, 'Good Morning!');
        sendImage(number, "image1.jpg", "1");
        await new Promise(resolve => setTimeout(resolve, 5000));
        sendImage(number, "image2.jpg", "2");
        await new Promise(resolve => setTimeout(resolve, 5000));
        sendImage(number, "image3.jpg", "3");
    }
});

function formatNumber(number) {
    return number.includes('@c.us') ? number : `${number.replace(/\D/g, '')}@c.us`;
}

async function sendMessage(phoneNumber, text) {
    if (!clientReady) {
        console.log('Client not ready yet, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    const chatId = formatNumber(phoneNumber);
    try {
        await client.sendMessage(chatId, text);
        console.log(`Text message sent to ${phoneNumber}`);
    } catch (err) {
        console.error('Error sending text:', err);
    }
}

async function sendImage(phoneNumber, imagePath, caption = '') {
    if (!clientReady) {
        console.log('Client not ready yet, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    const chatId = formatNumber(phoneNumber);
    try {
        const media = MessageMedia.fromFilePath(imagePath);
        await client.sendMessage(chatId, media, { caption });
        console.log(`Image sent to ${phoneNumber}`);
    } catch (err) {
        console.error('Error sending image:', err);
    }
}

module.exports = { sendMessage, sendImage, client };
