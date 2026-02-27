const TelegramBot = require('node-telegram-bot-api');

// Bot tokeni
const token = '8598676893:AAElUKnA2EiH6fUy6BhXUhgiIIrwRnyCCKw';

// Murojaatlarni qabul qiladigan guruh ID raqami
const ADMIN_GROUP_ID = '-3773266037';

// Botni ishga tushirish
const bot = new TelegramBot(token, { polling: true });

// Foydalanuvchilarning sessiyalarini saqlash
const sessions = {};
let appealCounter = 1;

// ==========================================
// MA'LUMOTLAR BAZASI (NAMANGAN SHAHAR)
// ==========================================
const db = {
    appealTypes: [
        "1. Avtomototransport vositalari haydovchilarini tayyorlash",
        "2. To'lov-kontrakt",
        "3. Ilm-fan, sport, sanat va madaniyat o'quv kurslari",
        "4. Olimpiada va tanlovlar (mahalliy bosqich) xarajatlari",
        "5. Davolanish bilan bog'liq xarajatlar",
        "6. Safarbarlik chaqiruvi rezervidagi xizmat badali",
        "7. 12 oygacha turar joy ijarasi",
        "8. Olimpiada va tanlovlar (xalqaro bosqich) xarajatlari",
        "9. Parasport to'garaklari yo'lkira xarajatlari",
        "10. Tadbirkorlik va kasblarga o'qish",
        "11. Sport formasi, musiqa va cholg'u asboblari",
        "12. Noturar joy ijarasi yoki jihozlar uchun subsidiya",
        "13. \"Yoshlar daftari\" elektron platformasida ro'yxatda turish"
    ],
    mahallas: [
        { name: "Баркамол авлод", leaderName: "Отамирзаев Рахматиллохон", leaderPhone: "+998 95 023-50-07" },
        { name: "Ғишт кўприк", leaderName: "Юсупов Довудхон", leaderPhone: "+998 93 408-62-32" },
        { name: "Гузар", leaderName: "Юлчиев Ғайратжон", leaderPhone: "+998 94 374-99-22" },
        { name: "Маданий Маориф", leaderName: "Хабибуллаев Юсуфхўжа", leaderPhone: "+998 94 706-76-79" },
        { name: "Сумалак гузари", leaderName: "Исламов Нурмухаммад-Бобур", leaderPhone: "+998 91 361-31-41" },
        { name: "Обжувоз", leaderName: "Каримов Жамолхон", leaderPhone: "+998 94 594-57-54" },
        { name: "Олтитош", leaderName: "Абдуғаниев Яҳёхон", leaderPhone: "+998 94 502-23-43" },
        { name: "Саноат", leaderName: "Усмоналиев Алишер", leaderPhone: "+998 99 177-83-30" },
        { name: "Шаршара", leaderName: "Ғаниев Хасанхон", leaderPhone: "+998 90 698-18-18" },
        { name: "Яккасада", leaderName: "Абдуллаев Мирзохид", leaderPhone: "+998 93 947-55-60" },
        { name: "Яккатут", leaderName: "Жўрахўжаев Саиджалол", leaderPhone: "+998 93 818-20-02" },
        { name: "Янги қурилиш", leaderName: "Акбаров Отабек", leaderPhone: "+998 91 367-97-95" },
        { name: "Янги хаёт", leaderName: "Бурханов Зикрилло", leaderPhone: "+998 90 260-13-43" },
        { name: "Чаман", leaderName: "Абдуганиев Кобилжон", leaderPhone: "+998 93 916-00-29" },
        { name: "Қувонч", leaderName: "Махмудов Козимжон", leaderPhone: "+998 50 884-01-35" },
        { name: "Гулбоғ", leaderName: "Норматова Сабохат", leaderPhone: "+998 93 199-95-49" },
        { name: "Озод", leaderName: "Олимжанов Нурмуҳаммад", leaderPhone: "+998 90 696-77-00" },
        { name: "Учқун", leaderName: "Бодиров Кишварбек", leaderPhone: "+998 94 107-70-13" },
        { name: "Ибрат", leaderName: "Қурбоналиев Асадбек", leaderPhone: "+998 97 103-07-06" },
        { name: "Янги йўл", leaderName: "Пазлиев Азизбек", leaderPhone: "+998 99 365-61-61" },
        { name: "Ғунча", leaderName: "Ахмаджонов Мирвохид", leaderPhone: "+998 99 326-52-96" },
        { name: "Курашхона", leaderName: "Толибов Исмоил", leaderPhone: "+998 93 054-01-51" },
        { name: "Нурафшон", leaderName: "Абдураимов Дилмурод", leaderPhone: "+998 93 778-60-89" },
        { name: "Байналминал", leaderName: "Ахмадалиев Асадбек", leaderPhone: "+998 94 177-77-42" },
        { name: "Даштбоғ", leaderName: "Қаюмова Дилшода", leaderPhone: "+998 99 915-35-00" },
        { name: "Диёр", leaderName: "Эргашева Дилноза", leaderPhone: "+998 97 056-12-00" },
        { name: "Заркент", leaderName: "Қаюмов Зохиджон", leaderPhone: "+998 91 365-17-00" },
        { name: "Оби-ҳаёт", leaderName: "Рахимов Аъзамжон", leaderPhone: "+998 97 259-75-75" },
        { name: "Сардоба", leaderName: "Ёқубов Рахмонжон", leaderPhone: "+998 91 357-44-83" },
        { name: "Шодлик", leaderName: "Саттаров Шукур", leaderPhone: "+998 93 491-21-71" },
        { name: "Равнақ", leaderName: "Убайдуллаев Дилмурод", leaderPhone: "+998 97 251-52-22" },
        { name: "Чорсу", leaderName: "Имеджанов Авазбек", leaderPhone: "+998 91 354-80-08" },
        { name: "Бобуршоҳ", leaderName: "Алиханов Шухрат", leaderPhone: "+998 91 182-34-34" },
        { name: "Бўстон", leaderName: "Ибрахимов Мухаммаджон", leaderPhone: "+998 93 677-77-55" },
        { name: "Ифтихор", leaderName: "Тўхтабаев Аъзам", leaderPhone: "+998 99 493-20-00" },
        { name: "Зарбдор", leaderName: "Тошпўлатов Боситхон", leaderPhone: "+998 97 259-98-98" },
        { name: "Зиёкор", leaderName: "Ташбаев Акмал", leaderPhone: "+998 90 156-10-01" },
        { name: "Илғор", leaderName: "Муминжанов Хабибулло", leaderPhone: "+998 99 936-36-15" },
        { name: "Қадамжо", leaderName: "Абдураззоқов Асилбек", leaderPhone: "+998 88 579-65-65" },
        { name: "Лола", leaderName: "Ворисов Камолиддин", leaderPhone: "+998 91 755-77-75" },
        { name: "Соҳибкор", leaderName: "Сулаймонов Довудхон", leaderPhone: "+998 91 353-23-73" },
        { name: "Ҳақиқат", leaderName: "Номанов Зохиджон", leaderPhone: "+998 93 924-05-00" },
        { name: "Чинор", leaderName: "Жалалов Исломжон", leaderPhone: "+998 94 013-33-11" },
        { name: "Шарқ Тонги", leaderName: "Тургунов Нозимжон", leaderPhone: "+998 94 776-07-06" },
        { name: "Ойдинкўл", leaderName: "Абдурахманов Бахромжон", leaderPhone: "+998 94 276-33-11" },
        { name: "Дамбоғ", leaderName: "Насретдинов Адхамжон", leaderPhone: "+998 91 345-53-53" },
        { name: "Марғилон", leaderName: "Вакант", leaderPhone: "Мавжуд эмас" },
        { name: "Маърифат", leaderName: "Умрзоқов Жасурбек", leaderPhone: "+998 97 622-57-59" },
        { name: "Обод", leaderName: "Нажмиддинов Элбек", leaderPhone: "+998 99 511-33-76" },
        { name: "Олвализор", leaderName: "Алишеров Исломжон", leaderPhone: "+998 88 527-20-05" },
        { name: "Тараққиёт", leaderName: "Ходжаев Алишер", leaderPhone: "+998 90 599-22-33" },
        { name: "Янги аср", leaderName: "Зайниддинов Фарходжон", leaderPhone: "+998 93 403-84-88" },
        { name: "Алпомиш", leaderName: "Мирзаахматов Абдулазиз", leaderPhone: "+998 91 364-33-22" },
        { name: "Зарафшон", leaderName: "Абдумажидов Улуғбек", leaderPhone: "+998 95 212-00-30" },
        { name: "Мажнунтол", leaderName: "Алижанов Козимжон", leaderPhone: "+998 99 008-24-26" },
        { name: "Меҳрибонлик", leaderName: "Нажмиддинов Бахромжон", leaderPhone: "+998 93 269-00-02" },
        { name: "Фаровон", leaderName: "Турсунова Мафтуна", leaderPhone: "+998 77 004-95-11" },
        { name: "Янги обод", leaderName: "Бахрамова Салимабону", leaderPhone: "+998 93 924-31-32" },
        { name: "Баҳор", leaderName: "Турғунов Исломжон", leaderPhone: "+998 90 552-34-33" }
    ]
};
// ==========================================

// Massivni ma'lum o'lchamda bo'laklarga bo'luvchi yordamchi funksiya
function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// /start buyrug'ini qabul qilish
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    sessions[chatId] = { step: 'AWAITING_NAME' };
    
    bot.sendMessage(chatId, "Assalomu Alaykum, Xush kelibsiz! Iltimos, F.I.SH (Familya ism sharif) kiriting:", {
        reply_markup: { remove_keyboard: true }
    });
});

// Barcha xabarlarni eshitish
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const session = sessions[chatId];

    // Agar /start bo'lsa yoki sessiya yo'q bo'lsa, pastga o'tmaslik
    if (text === '/start' || !session) return;

    switch (session.step) {
        case 'AWAITING_NAME':
            session.name = text;
            session.step = 'AWAITING_MAHALLA';
            
            // JSON dan mahalla nomlarini ajratib olish
            const mahallaNames = db.mahallas.map(m => m.name);
            const mahallaButtons = chunkArray(mahallaNames, 2).map(row => row.map(name => ({ text: name })));
            
            bot.sendMessage(chatId, "Quyidagi ro'yxatdan o'z mahallangizni tanlang:", {
                reply_markup: {
                    keyboard: mahallaButtons,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            break;

        case 'AWAITING_MAHALLA':
            session.mahalla = text;
            session.step = 'AWAITING_ADDRESS';
            
            bot.sendMessage(chatId, "Manzilni kiriting (Ko'cha va uy raqami):", {
                reply_markup: { remove_keyboard: true }
            });
            break;

        case 'AWAITING_ADDRESS':
            session.address = text;
            session.step = 'AWAITING_PHONE';
            
            bot.sendMessage(chatId, "Telefon raqamingizni yuboring:", {
                reply_markup: {
                    keyboard: [[{ text: "📞 Telefon Raqamni ulashish", request_contact: true }]],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            break;

        case 'AWAITING_PHONE':
            session.phone = msg.contact ? msg.contact.phone_number : text;
            session.step = 'AWAITING_AGE';
            
            const ages = [];
            for (let i = 14; i <= 30; i++) ages.push(i.toString());
            const ageButtons = chunkArray(ages, 4).map(row => row.map(age => ({ text: age })));
            
            bot.sendMessage(chatId, "Yoshingizni tanlang (14-30):", {
                reply_markup: {
                    keyboard: ageButtons,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            break;

        case 'AWAITING_AGE':
            session.age = text;
            session.step = 'AWAITING_APPEAL_TYPE';
            
            // JSON dan murojaat turlarini ajratib olish (1 ta qatorda 1 ta tugma qilib chiqaramiz)
            const appealButtons = chunkArray(db.appealTypes, 1).map(row => row.map(type => ({ text: type })));
            
            bot.sendMessage(chatId, "Murojaat turini tanlang:", {
                reply_markup: {
                    keyboard: appealButtons,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            break;

        case 'AWAITING_APPEAL_TYPE':
            session.appealType = text;
            session.step = 'AWAITING_LEADER_CONTACT';
            
            bot.sendMessage(chatId, "Ushbu murojaat turi bo'yicha Mahallangiz Yoshlar yetakchisiga murojaat qilganmisiz?", {
                reply_markup: {
                    keyboard: [[{ text: "Ha" }, { text: "Yo'q" }]],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            break;

        case 'AWAITING_LEADER_CONTACT':
            if (text === "Ha") {
                session.step = 'AWAITING_APPEAL_TEXT';
                bot.sendMessage(chatId, "Murojaatingizni yozib qoldiring, biz 3 ish kunida aloqaga chiqamiz!", {
                    reply_markup: { remove_keyboard: true }
                });
            } else if (text === "Yo'q") {
                // JSON dan tanlangan mahallaga mos yetakchini topish
                const matchedMahalla = db.mahallas.find(m => m.name === session.mahalla);
                const leaderName = matchedMahalla ? matchedMahalla.leaderName : "Biriktirilmagan";
                const leaderPhone = matchedMahalla ? matchedMahalla.leaderPhone : "Mavjud emas";

                bot.sendMessage(chatId, `Iltimos, avval Mahallangiz Yoshlar Yetakchisiga murojaat qiling!\n\n🏢 Mahalla: **${session.mahalla}**\n👤 Yoshlar Yetakchisi F.I.SH: **${leaderName}**\n📞 Telefon raqami: **${leaderPhone}**`, {
                    parse_mode: "Markdown",
                    reply_markup: { remove_keyboard: true }
                });
                
                delete sessions[chatId];
            } else {
                bot.sendMessage(chatId, "Iltimos, pastdagi 'Ha' yoki 'Yo'q' tugmalaridan birini tanlang.");
            }
            break;

        case 'AWAITING_APPEAL_TEXT':
            session.appealText = text;
            
            bot.sendMessage(chatId, "Rahmat! Murojaatingiz muvaffaqiyatli qabul qilindi va tizimga yozildi. Tez orada siz bilan bog'lanamiz.", {
                reply_markup: { remove_keyboard: true }
            });

            // O'zbekiston vaqti bilan sanani olish
            const date = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

            // Guruhga yuboriladigan xabar shabloni
            const adminMessage = `
🆕 *YANGI MUROJAT*
🔢 Tartib raqami: #${appealCounter}
📅 Sana: ${date}

👤 *F.I.SH:* ${session.name}
🏢 *Mahalla:* ${session.mahalla}
📍 *Manzil:* ${session.address}
📞 *Telefon raqam:* ${session.phone}
🎂 *Yoshi:* ${session.age}
📌 *Murojaat turi:* ${session.appealType}

📝 *Murojaat matni:*
${session.appealText}
            `;

            // Xabarni guruhga yuborish
            bot.sendMessage(ADMIN_GROUP_ID, adminMessage, { parse_mode: "Markdown" })
                .then(() => {
                    console.log(`Murojaat #${appealCounter} guruhga yuborildi.`);
                    appealCounter++; // Keyingi murojaat uchun raqamni oshirish
                })
                .catch((err) => {
                    console.log("Guruhga yuborishda xatolik:", err.message);
                });

            // Sessiyani tozalash
            delete sessions[chatId];
            break;
    }
});

// Xatoliklarni ushlash
bot.on('polling_error', (error) => {
    console.log("Botda xatolik yuz berdi:", error.code);
    console.log("Xatolikning aniq sababi:", error.message);
});

console.log("Namangan Yoshlar Murojaati boti tayyor holatda ishga tushdi...");
