// require('dotenv').config();
// const TelegramBot = require('node-telegram-bot-api');
// const express = require('express');
// const cors = require('cors');
//
// const token = process.env.BOT_TOKEN;
// const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:4200';
// const port = process.env.PORT || 3000;
//
// // Create bot instance
// const bot = new TelegramBot(token, { polling: true });
//
// // Create Express app
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// // In-memory storage for demo purposes
// const userData = new Map();
//
// // Bot commands
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;
//     const firstName = msg.from.first_name || 'User';
//
//     // Initialize user data
//     if (!userData.has(chatId)) {
//         userData.set(chatId, {
//             userId: chatId,
//             firstName: firstName,
//             balance: 3257.00,
//             income: 2350.00,
//             expenses: 950.00,
//             transactions: [
//                 { id: 1, type: 'expense', title: 'Restaurant', amount: 450, time: '12:35 PM', icon: '🍽️', color: 'rgba(239, 68, 68, 0.2)' },
//                 { id: 2, type: 'income', title: 'Shopping', amount: 1200, time: '10:20 AM', icon: '�️', color: 'rgba(16, 185, 129, 0.2)' },
//                 { id: 3, type: 'expense', title: 'Transport', amount: 150, time: '08:40 AM', icon: '🚗', color: 'rgba(249, 115, 22, 0.2)' },
//                 { id: 4, type: 'expense', title: 'Restaurant', amount: 200, time: 'Yesterday', icon: '🍽️', color: 'rgba(239, 68, 68, 0.2)' },
//                 { id: 5, type: 'expense', title: 'Shopping', amount: 600, time: 'Yesterday', icon: '🛍️', color: 'rgba(168, 85, 247, 0.2)' }
//             ],
//             cards: [
//                 { id: 1, number: '4836 7489 4562 1258', balance: 2310.00, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
//                 { id: 2, number: '5247 5687 3025 5697', balance: 3257.00, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
//                 { id: 3, number: '8475 2358 2259 2053', balance: 1962.00, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
//             ]
//         });
//     }
//
//     bot.sendMessage(chatId, `Salom, ${firstName}! 👋\n\nExpenzor - Moliyaviy menejment ilovasiga xush kelibsiz!\n\nPul oqimingizni kuzatish va moliyaviy maqsadlaringizga erishish uchun ilovani oching.`, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: '💰 Ilovani ochish', web_app: { url: `${webAppUrl}/home` } }]
//             ]
//         }
//     });
// });
//
// bot.onText(/\/app/, (msg) => {
//     const chatId = msg.chat.id;
//
//     bot.sendMessage(chatId, 'Ilovani ochish uchun quyidagi tugmani bosing:', {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: '💰 Ilovani ochish', web_app: { url: `${webAppUrl}/home` } }]
//             ]
//         }
//     });
// });
//
// // API endpoints for the webview
// app.get('/api/user/:userId', (req, res) => {
//     const userId = parseInt(req.params.userId);
//     const user = userData.get(userId);
//
//     if (user) {
//         res.json(user);
//     } else {
//         res.status(404).json({ error: 'User not found' });
//     }
// });
//
// app.post('/api/transaction', (req, res) => {
//     const { userId, type, title, amount, category } = req.body;
//     const user = userData.get(userId);
//
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//     }
//
//     const newTransaction = {
//         id: user.transactions.length + 1,
//         type,
//         title,
//         amount: parseFloat(amount),
//         time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//         icon: type === 'income' ? '💵' : '💸',
//         category
//     };
//
//     user.transactions.unshift(newTransaction);
//
//     if (type === 'income') {
//         user.income += parseFloat(amount);
//         user.balance += parseFloat(amount);
//     } else {
//         user.expenses += parseFloat(amount);
//         user.balance -= parseFloat(amount);
//     }
//
//     userData.set(userId, user);
//     res.json({ success: true, user });
// });
//
// app.listen(port, () => {
//     console.log(`🚀 Server running on port ${port}`);
//     console.log(`🤖 Telegram bot is active`);
//     console.log(`🌐 WebApp URL: ${webAppUrl}`);
// });
//
// console.log('Bot is running...');
