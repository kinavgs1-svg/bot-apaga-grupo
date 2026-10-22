const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

console.log('Iniciando bot...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
        executablePath: puppeteer.executablePath()
    }
});

client.on('qr', (qr) => {
    console.log('QR CODE GERADO:');
    qrcode.generate(qr, { small: true });
    console.log(qr);
});

client.on('ready', () => {
    console.log('✅ Bot conectado!');
});

client.on('message', async msg => {
    if (msg.body === '!apagar' && msg.from.endsWith('@g.us')) {
        const chat = await msg.getChat();
        if (chat.isGroup) {
            const messages = await chat.fetchMessages({ limit: 100 });
            for (let m of messages) {
                if (m.fromMe) {
                    try { await m.delete(true); } catch(e){}
                }
            }
            msg.reply('Mensagens minhas apagadas!');
        }
    }
});

client.initialize();
