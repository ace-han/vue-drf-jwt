import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './en'
import zhHans from './zh-Hans'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'zh-Hans',
  fallbackLocale: 'en',
  messages: {
    en: en,
    'zh-Hans': zhHans
  }
})
