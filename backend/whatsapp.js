const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const csv = require('csv-parser');
const { exec } = require('child_process');

let clientReady = false;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    },
});

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR code with your WhatsApp.');
});


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


function loadTargetsFromCSV(filePath){
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath) 
        .pipe(csv())
        .on("data", (row) => {
            if (row.IsSend.trim().toLowerCase() === 'true'){
            results.push(row.ID);
        }    
    })
        .on("end", () => {
            resolve(results); 
        })
        .on("error", reject);
    });
}
client.on('ready', async () => {
    console.log('WhatsApp client is ready!');
    console.log('Waiting 10 seconds to allow you to close dialog boxes...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    clientReady = true;
    console.log('Client is now fully ready.');

    const targets = await loadTargetsFromCSV('data/chats.csv');

    console.log('All targets:', targets);

    for (const target of targets) {
        await sendImage(target, 'images/image1.jpeg');
    }

    for (const target of targets) {
        await sendImage(target, 'images/image2.jpeg');
    }

    for (const target of targets) {
        await sendImage(target, 'images/image3.jpeg');
    }

    for (const target of targets) {
        await sendMessage(target, 'Blessed morning!');
    }

    await new Promise(resolve => setTimeout(resolve, 600000));

    client.destroy();

    exec("lsof -ti :3001 | xargs kill -9 2>/dev/null && lsof -ti :5173 | xargs kill -9 2>/dev/null", (error, stdout, stderr) => {
    if (error) {
        console.error(`Error killing processes: ${error.message}`);
        return;
    }
    console.log("Successfully killed processes on ports 3001 and 5173");
    });

});

module.exports = { sendMessage, sendImage, client };
