const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => qrcode.generate(qr, {small: true}));
client.on('ready', () => console.log('BOT ANTI-VENDA TIBIA ONLINE!'));

function ehVendaProibida(texto) {
    const t = texto.toLowerCase();
    // Pega até com erro de digitação: vendo, verndo, vedno
    const regexVenda = /(v[e3]r?n?d[oa]|vend[oa]).*(itens|item|kks?|char|conta|gold|gp|auroria|ek|ed|rp|ms|kina|mage)/i;
    return regexVenda.test(t);
}

client.on('message', async msg => {
    const chat = await msg.getChat();
    if (!chat.isGroup || msg.fromMe) return;

    if (ehVendaProibida(msg.body)) {
        try {
            await msg.delete(true);
            const autor = msg.author || msg.from;
            await chat.sendMessage(`🚫 Venda apagada de @${autor.split('@')[0]}! Proibido vender char/kks/itens aqui.`, { mentions: [autor] });
        } catch (e) { console.log('Preciso ser ADM!'); }
    }
});
client.initialize();
