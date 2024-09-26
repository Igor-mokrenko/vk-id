### Установка зависимостей
```
npm i
```
### Сборка веб версии 
(необходимо собирать каждый раз перед запуском в эмуляторе если в ангуляр коде что-либо менялось)
```
npm run build
```
### Синхронизация capacitor
```
npx cap sync
```

### Открыть проект в android studio 
```
npx cap open android
```

### Запуск эмулятора из консоли
```
npx cap run android
```

## Описание проблемы
В репозитории 2 ветки:
- main - рабочая версия приложения
- plugin - версия с подключенным плагином.
Приложение для андроида вылетает при запуске в эмуляторе на этапе сплеш скрина, ошибка в логах (logcat).
На устройстве та же проблема. Если поменять версию com.vk.id:onetap-compose (vk-id-plugin-capacitor/android/build.gradle) на 1.3.2
то приложение запускается и работает. Тестировалось на версии Android SDK 34
