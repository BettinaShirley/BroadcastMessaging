const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

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
    console.log('Client is ready! Fetching chats...');

    try {
        const chats = await client.getChats();

        const csvLines = [
            ['Name', 'ID', 'IsGroup'],
            ...chats.map(chat => [
                `"${chat.name || ''}"`,
                `"${chat.id._serialized}"`,
                chat.isGroup
            ])
        ];

        const outputPath = path.join(__dirname, 'chats.csv');
        const csvContent = csvLines.map(row => row.join(',')).join('\n');

        fs.writeFileSync(outputPath, csvContent);
        console.log(`Chats written to ${outputPath}`);
    } catch (err) {
        console.error('Error fetching or writing chats:', err);
    } finally {
        client.destroy();
    }
});
