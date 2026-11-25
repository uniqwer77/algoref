import type { CoverBlock } from './types';

export const createCover = (): CoverBlock => ({
  id: crypto.randomUUID(),
  type: 'cover',
  layout: 'split',
  theme: 'dark',
  spacing: 'normal',
  showImage: true,
  content: {
    eyebrow: '<p>Онлайн-курс · 4 месяца · с трудоустройством</p>',
    title: '<p>Дизайн интерфейсов с нуля до уровня middle</p>',
    subtitle:
      '<p>Научитесь проектировать продукты, которыми пользуются миллионы. 80% практики, личный наставник и реальный кейс в портфолио.</p>',
    primaryButton: '<p>Записаться на курс</p>',
    secondaryButton: '<p>Скачать программу</p>',
  },
  badges: ['Старт 1 июля', 'Рассрочка 0%', 'Помощь с работой'],
  offsets: {},
  sizes: {},
  image: {
    width: 400,
    height: 500 
  },
  hidden: false
});
