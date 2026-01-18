import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Heart, Send, CheckCircle, XCircle, Map, Camera, Utensils, Music, Palette, Gift } from 'lucide-react';

const App = () => {
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState({ name: '', attending: '' });

  // Свадебные цвета (выбраны гармоничная палитра)
  const weddingColors = {
    primary: '#d4a5a5', // Нежно-розовый
    secondary: '#f9f5f0', // Кремовый
    accent: '#8b6b49', // Золотисто-коричневый
    text: '#2c1810',
    // Дополнительные цвета для палитры
    blush: '#e8c3c3',
    champagne: '#f7e9d9',
    sage: '#c8b99f',
    ivory: '#fffff0'
  };

  // Расписание свадьбы с иконками
  const schedule = [
    {
      time: '14:00',
      event: 'Церемония бракосочетания',
      location: 'ЗАГС на Тверской',
      icon: Map
    },
    {
      time: '16:00',
      event: 'Фотосессия и фуршет',
      location: 'Парк Горького',
      icon: Camera
    },
    {
      time: '18:00',
      event: 'Торжественный ужин',
      location: 'Ресторан "Веранда"',
      icon: Utensils
    },
    {
      time: '20:00',
      event: 'Первый танец и празднование',
      location: 'Ресторан "Веранда"',
      icon: Music
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newResponse.name.trim() && newResponse.attending) {
      setResponses([...responses, { ...newResponse, id: Date.now() }]);
      setNewResponse({ name: '', attending: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-pink-300"></div>
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-amber-300"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-rose-300"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full bg-pink-200"></div>
      </div>

      {/* Header */}
      <header className="text-center py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Heart className="w-20 h-20 mx-auto text-pink-400" style={{ color: weddingColors.primary }} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
            Ксюша & Лёша
          </h1>
          <p className="text-2xl md:text-3xl font-light italic" style={{ color: weddingColors.accent, fontFamily: 'Georgia, serif' }}>
            Приглашение на свадьбу
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-amber-400 to-rose-400 mx-auto mt-8 rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-20 relative z-10">
        {/* Приглашение */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-pink-100/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-serif mb-8" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
              Дорогие друзья!
            </h2>
            <div className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-4xl mx-auto font-light">
              <p className="mb-6">
                С огромной радостью приглашаем вас разделить с нами один из самых важных дней в нашей жизни!
              </p>
              <p className="mb-6">
                После долгих лет любви, поддержки и совместного пути мы решили официально оформить наши отношения.
              </p>
              <p className="text-xl font-medium italic" style={{ color: weddingColors.accent, fontFamily: 'Georgia, serif' }}>
                Ваше присутствие сделает этот день по-настоящему особенным для нас!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="text-center p-8 bg-gradient-to-br from-pink-50/70 to-amber-50/70 rounded-2xl backdrop-blur-sm border border-pink-200/50">
              <Calendar className="w-16 h-16 mx-auto mb-6 text-pink-500" />
              <h3 className="text-2xl font-serif mb-4" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>Дата</h3>
              <p className="text-xl">15 июня 2026 года</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-pink-50/70 to-amber-50/70 rounded-2xl backdrop-blur-sm border border-pink-200/50">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-amber-500" />
              <h3 className="text-2xl font-serif mb-4" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>Место</h3>
              <p className="text-xl">Тверская улица, д. 1</p>
            </div>
          </div>
        </section>

        {/* Цвета свадьбы */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-pink-100/50">
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full mb-6">
              <Palette className="w-12 h-12 mx-auto" style={{ color: weddingColors.accent }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
              Цвета нашей свадьбы
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light mb-8">
              Мы выбрали эту палитру, чтобы создать гармоничную и элегантную атмосферу. 
              Цвета помогают объединить все элементы декора, букетов, одежды и создают целостное впечатление от праздника.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mb-3" style={{ backgroundColor: weddingColors.blush }}></div>
              <p className="text-sm font-medium text-gray-700">Нежно-розовый</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mb-3" style={{ backgroundColor: weddingColors.champagne }}></div>
              <p className="text-sm font-medium text-gray-700">Шампань</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mb-3" style={{ backgroundColor: weddingColors.sage }}></div>
              <p className="text-sm font-medium text-gray-700">Серо-зеленый</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mb-3" style={{ backgroundColor: weddingColors.ivory }}></div>
              <p className="text-sm font-medium text-gray-700">Слоновая кость</p>
            </div>
          </div>
        </section>

        {/* Подарки */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-pink-100/50">
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full mb-6">
              <Gift className="w-12 h-12 mx-auto" style={{ color: weddingColors.accent }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
              О подарках
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-amber-500 mx-auto rounded-full mb-8"></div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light mb-6">
              Ваше присутствие — самый ценный подарок для нас! 💕
            </p>
            <div className="bg-gradient-to-r from-pink-50/70 to-amber-50/70 rounded-2xl p-6 border border-pink-200/50">
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-medium italic">
                Если вы планируете помимо основного подарка принести цветы, то мы были бы очень рады, 
                если бы вы их заменили, например, на бутылку вашего любимого вина.
              </p>
            </div>
            <p className="text-gray-600 mt-6 font-light">
              Это поможет нам создать особенную коллекцию вин для наших будущих романтических вечеров вместе!
            </p>
          </div>
        </section>

        {/* Карта */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-pink-100/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif mb-6" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
              Место проведения
            </h2>
            <p className="text-lg text-gray-600 mb-6">Тверская улица, д. 1, Москва</p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-amber-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Placeholder for Yandex Maps - in real implementation you would embed the actual map */}
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl border-2 border-dashed border-blue-300 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium text-blue-700">Карта Яндекса</p>
              <p className="text-sm text-blue-600">Тверская улица, д. 1</p>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-gray-500">
            В реальной версии здесь будет интерактивная карта Яндекса
          </p>
        </section>

        {/* Расписание */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-pink-100/50">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
              Тайминги мероприятия
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8">
            {schedule.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-6 bg-gradient-to-r from-pink-50/50 to-amber-50/50 rounded-2xl backdrop-blur-sm border border-pink-200/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-pink-200">
                    <IconComponent className="w-8 h-8" style={{ color: weddingColors.accent }} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-xl md:text-2xl font-serif font-medium" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
                        {item.event}
                      </h3>
                      <span className="text-lg font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{item.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Форма RSVP */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-pink-100/50">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
              Подтвердите участие
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Пожалуйста, сообщите нам заранее, сможете ли вы присутствовать на нашем празднике. 
              Это поможет нам лучше организовать торжество!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-amber-500 mx-auto rounded-full mt-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-8">
              <label htmlFor="name" className="block text-xl font-serif mb-3" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
                Ваши ФИО
              </label>
              <input
                type="text"
                id="name"
                value={newResponse.name}
                onChange={(e) => setNewResponse({ ...newResponse, name: e.target.value })}
                className="w-full px-6 py-4 border-2 border-pink-200 rounded-2xl focus:ring-3 focus:ring-pink-300 focus:border-transparent outline-none transition-all text-lg"
                placeholder="Введите ваше полное имя"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-xl font-serif mb-4" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
                Будете ли вы присутствовать?
              </label>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setNewResponse({ ...newResponse, attending: 'yes' })}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-serif text-lg transition-all transform hover:scale-105 ${
                    newResponse.attending === 'yes'
                      ? 'bg-green-100 text-green-800 border-2 border-green-300 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Да, буду!</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewResponse({ ...newResponse, attending: 'no' })}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-serif text-lg transition-all transform hover:scale-105 ${
                    newResponse.attending === 'no'
                      ? 'bg-red-100 text-red-800 border-2 border-red-300 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  <XCircle className="w-6 h-6" />
                  <span>К сожалению, нет</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!newResponse.name.trim() || !newResponse.attending}
              className="w-full bg-gradient-to-r from-pink-400 to-amber-500 hover:from-pink-500 hover:to-amber-600 text-white font-serif text-xl py-5 px-8 rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
            >
              <Send className="w-6 h-6" />
              <span>Отправить ответ</span>
            </button>
          </form>

          {/* Таблица ответов */}
          {responses.length > 0 && (
            <div className="mt-12 pt-8 border-t border-pink-200/50">
              <h3 className="text-2xl md:text-3xl font-serif mb-6 text-center" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
                Полученные ответы ({responses.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-pink-50/50">
                      <th className="px-6 py-4 text-left font-serif text-lg" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>ФИО</th>
                      <th className="px-6 py-4 text-left font-serif text-lg" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response) => (
                      <tr key={response.id} className="border-b border-pink-100/30 hover:bg-pink-25/50 transition-colors">
                        <td className="px-6 py-4 font-serif">{response.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-serif font-medium ${
                            response.attending === 'yes'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {response.attending === 'yes' ? 'Будет присутствовать' : 'Не сможет прийти'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 px-4 bg-white/70 backdrop-blur-sm border-t border-pink-100/50 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block p-4 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full mb-6">
            <Heart className="w-12 h-12 text-pink-400" style={{ color: weddingColors.primary }} />
          </div>
          <p className="text-2xl md:text-3xl font-serif mb-4" style={{ color: weddingColors.text, fontFamily: 'Georgia, serif' }}>
            С любовью, Ксюша и Лёша 💕
          </p>
          <p className="text-lg text-gray-600 font-light">
            Мы с нетерпением ждем встречи с вами в этот особенный день!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
