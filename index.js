const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('Iniciando...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
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
                }
            }
            msg.reply('✅ Todos os grupos limpos!');
        } catch (e) {
            msg.reply('Erro: ' + e.message);
        }
    }
});

client.initialize();
