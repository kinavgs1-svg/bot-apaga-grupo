const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

console.log('Iniciando bot...');

(async () => {
  const executablePath = await chromium.executablePath();
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath,
      headless: true,
      args: chromium.args.concat(['--no-sandbox','--disable-setuid-sandbox','--single-process','--no-zygote'])
    }
  });

  client.on('qr', qr => { console.log('QR RECEBIDO:'); qrcode.generate(qr, {small: true}); });
  client.on('ready', () => console.log('TUDO PRONTO!'));
  client.initialize();
})();
