const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// توکن بات مستقیم
const token = '8134187462:AAHlwuANjWdEFbraKjuKh-vSCYMbuWt92ow';

// ایجاد بات در حالت polling
const bot = new TelegramBot(token, { polling: true });

// مسیر فایل دیتابیس
const dbFile = './database.json';

// اگر دیتابیس نبود، بسازش
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

// بارگیری دیتا
let db = JSON.parse(fs.readFileSync(dbFile));

// شروع بات
bot.onText(/\/start(?:\s+(\d+))?/, (msg, match) => {
  const userId = msg.from.id.toString();
  const inviterId = match[1];

  if (!db[userId]) {
    db[userId] = { invites: 0 };

    // اگر کسی دعوت کرده بود، امتیاز بده
    if (inviterId && db[inviterId]) {
      db[inviterId].invites += 1;
    }

    fs.writeFileSync(dbFile, JSON.stringify(db));
  }

  // دکمه‌های شیشه‌ای
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎯 لینک دعوت من', callback_data: 'my_invite' },
          { text: '🏆 جدول برترین‌ها', callback_data: 'top_users' }
        ],
        [
          { text: '🔁 دعوت دوستان', callback_data: 'share_invite' },
          { text: '❓ راهنما', callback_data: 'help' }
        ]
      ]
    }
  };

  bot.sendMessage(msg.chat.id, `🎉 خوش‌اومدی به ربات هخامنشی!\n\nبا دکمه‌های زیر ادامه بده:`, keyboard);
});
