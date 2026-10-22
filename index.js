const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

console.log('Iniciando...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        executablePath: puppeteer.executablePath()
    }
});

client.on('qr', qr => {
    console.log('QR CODE GERADO! ESCANEIE:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ BOT CONECTADO! Pronto pra apagar grupos');
});

client.on('message', async msg => {
    if (msg.body === '!apagartudo' || msg.body === '!apagar') {
        try {
            const chats = await client.getChats();
            for (let chat of chats) {
                if (chat.isGroup) {
                    await chat.clearMessages();
                    console.log(`Apagado: ${chat.name}`);
                }
            }
            msg.reply('✅ Todos os grupos limpos!');
        } catch (e) {
            console.log(e);
            msg.reply('Erro: ' + e.message);
        }
    }
});

client.initialize();
