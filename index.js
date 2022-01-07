const TelegramApi = require("node-telegram-bot-api")
const axios = require("axios")

const token = "5082867538:AAEcrYAqAmDQ1ZUb3EiLVQlZ--qP9kC1Fnc"

const bot = new TelegramApi(token, {polling: true})

const options = {
    reply_markup : JSON.stringify({
        inline_keyboard : [
            [{text: ' Показать все товары ', callback_data : 1}],
            [{text: ' Показать первый товар ', callback_data: 3}]
        ]
    })
}

bot.setMyCommands([
    {command: "/start", description: "Получить команды"}
])

bot.on("message", (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    console.log(chatId)

    if (text === "/start") {
        bot.sendMessage(chatId, "Здравствуйте, Вас приветствует магазин fakestore", options)
    }
})

bot.on("callback_query", async (msg) => {

    const resp = await axios("https://fakestoreapi.com/products")

    const data = msg.data
    const chatId = msg.message.chat.id


    switch (+data) {
        case 1 :
            for (let i = 0; i < resp.data.length; i++) {
                await bot.sendPhoto(chatId, resp.data[i].image, {caption: `🔍 Товар: ${resp.data[i].title}\n💲Цена: ${resp.data[i].price}$\n⭕Описание: ${resp.data[i].description}`})
            }
            break
        case 3 : bot.sendMessage(chatId, "Куртка: название")
    }
})