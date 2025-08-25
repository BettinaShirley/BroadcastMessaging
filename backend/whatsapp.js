require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const csv = require('csv-parser');

let clientReady = false;
let phoneNumbers = [];

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

function loadContactsFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const phones = [];

        fs.createReadStream(filePath)
            .pipe(csv({ headers: ['contactNo', 'name'], skipLines: 1 }))
            .on('data', (row) => {
                if (row.contactNo && row.contactNo.trim() !== '') {
                    phones.push(row.contactNo.trim());
                }
            })
            .on('end', () => {
                resolve(phones);
            })
            .on('error', reject);
    });
}

function loadGroupsFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const groups = [];

        fs.createReadStream(filePath)
            .pipe(csv({ headers: ['groupName'], skipLines: 1 }))
            .on('data', (row) => {
                if (row.groupName && row.groupName.trim() !== '') {
                    groups.push(row.groupName);
                }
            })
            .on('end', () => {
                resolve(groups);
            })
            .on('error', reject);
    });
}
client.on('ready', async () => {
    console.log('WhatsApp client is ready!');
    console.log('Waiting 10 seconds to allow you to close dialog boxes...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    clientReady = true;
    console.log('Client is now fully ready.');

    const phoneNumbers = await loadContactsFromCSV('data/individuals.csv');
    console.log('Phone numbers loaded:', phoneNumbers);

    const groupNames = await loadGroupsFromCSV('data/groups.csv');
    console.log('Group names loaded:', groupNames);

    const targets = [...phoneNumbers];

    for (const groupName of groupNames) {
        const groupId = await getGroupIdByName(groupName);
        if (groupId) targets.push(groupId);
    }
    console.log('All targets:', targets);

    for (const target of targets) {
        await sendMessage(target, 'Good Morning!');
    }

    for (const target of targets) {
        await sendImage(target, 'images/image1.jpeg', '1');
    }

    for (const target of targets) {
        await sendImage(target, 'images/image2.jpeg', '2');
    }

    for (const target of targets) {
        await sendImage(target, 'images/image3.jpeg', '3');
    }
    client.destroy();

});

module.exports = { sendMessage, sendImage, client };
