const TelegramBot = require('node-telegram-bot-api');
const dns = require('dns');

const token = '6374463825:AAGiU8_QWQveb4iOhg_OOHiXvcl4fRL1sjw';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/(.+)/, async (msg, match) => {
   const chatId = msg.chat.id;
   const domain = match[1];

   dns.resolve(domain, 'A', (err, addresses) => {
      if (err) {
         bot.sendMessage(chatId, `Erro ao resolver endereços IP para ${domain}: ${err}`);
         return;
      }

      let message = `Endereços IP para ${domain}:\n`;
      addresses.forEach((address) => {
         message += address + '\n';
      });

      bot.sendMessage(chatId, message);
   });

   dns.resolveNs(domain, (err, nameservers) => {
      if (err) {
         bot.sendMessage(chatId, `Erro ao resolver nameservers para ${domain}: ${err}`);
         return;
      }

      let message = 'Nameservers:\n';
      nameservers.forEach((nameserver, index) => {
         message += `${index + 1}. ${nameserver}\n`;
      });

      bot.sendMessage(chatId, message);
   });

   dns.resolveMx(domain, (err, mxRecords) => {
      if (err) {
         bot.sendMessage(chatId, `Erro ao resolver registros MX para ${domain}: ${err}`);
         return;
      }

      let message = 'Registros MX:\n';
      mxRecords.forEach((mxRecord, index) => {
         message += `${index + 1}. ${mxRecord.priority} ${mxRecord.exchange}\n`;
      });

      bot.sendMessage(chatId, message);
   });
});

// Inicialização do bot
bot.on('polling_error', (error) => {
   console.error(error);
});

console.log('Bot iniciado.');