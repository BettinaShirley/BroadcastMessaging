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

async function getGroupIdByName(name) {
    const chats = await client.getChats();
    const group = chats.find(c => c.isGroup && c.name === name);
    if (group) return group.id._serialized;
    console.error(`Group "${name}" not found!`);
    return null;
}

function formatNumber(number) {
    if (number.includes('@c.us') || number.includes('@g.us')) return number;
    return `${number.replace(/\D/g, '')}@c.us`;
}

async function sendMessage(target, text) {
    if (!clientReady) {
        console.log('Client not ready yet, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    const chatId = formatNumber(target);
    try {
        await client.sendMessage(chatId, text);
        console.log(`Text message sent to ${target}`);
    } catch (err) {
        console.error('Error sending text:', err);
    }
}

async function sendImage(target, imagePath, caption = '') {
    if (!clientReady) {
        console.log('Client not ready yet, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    const chatId = formatNumber(target);
    try {
        const media = MessageMedia.fromFilePath(imagePath);
        await client.sendMessage(chatId, media, { caption });
        console.log(`Image sent to ${target}`);
    } catch (err) {
        console.error('Error sending image:', err);
    }
}

client.on('ready', async () => {
    console.log('WhatsApp client is ready!');
    console.log('Waiting 10 seconds to allow you to close dialog boxes...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    clientReady = true;
    console.log('Client is now fully ready.');

    const phoneNumbers = Object.keys(process.env)
        .filter(key => key.startsWith('PHONE_'))
        .map(key => process.env[key]);

    const groupNames = Object.keys(process.env)
        .filter(key => key.startsWith('GROUP_'))
        .map(key => process.env[key]);

    const targets = [...phoneNumbers];

    for (const groupName of groupNames) {
        const groupId = await getGroupIdByName(groupName);
        if (groupId) targets.push(groupId);
    }

    for (const target of targets) {
        await sendMessage(target, 'Good Morning!');
    }

    for (const target of targets) {
        await sendImage(target, 'image1.jpg', '1');
    }

    for (const target of targets) {
        await sendImage(target, 'image2.jpg', '2');
    }

    for (const target of targets) {
        await sendImage(target, 'image3.jpg', '3');
    }
});

module.exports = { sendMessage, sendImage, client };
