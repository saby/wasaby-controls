# Визуальные контролы платформы
#### Содержит:
- Модуль с контролами
- Модуль с темой по-умолчанию
- Модуль с демо-примерами
- Юнит-тесты
#### Ответственные:
- Крайнов Д.О. (Разработка)
- Батурина Н.А.(Проектирование)
- Бегунова И.П.(Функциональное тестирование)
- Прошин Е.А.(Автоматическое UI тестирование)
#### Документация:
- [Документация для разработчиков](https://wasaby.dev/doc/platform/controls/)
- [API](https://wasaby.dev/docs/js/Controls/)
#
## Сборка и запуск.

1. Клонируйте репозиторий с контролами, например в папку `wasaby-controls` (все команды в следующих пунктах нужно будет выполнять в этой папке):

        git clone git@git.sbis.ru:saby/wasaby-controls.git /path/to/wasaby-controls

2. Переключите репозиторий на нужную ветку, например rc-19.100:

        git checkout rc-19.100

3. Установите [Node.js](http://nodejs.org/) и [NPM](http://npmjs.com).

4. Установите зависимости:

        npm install

5. Соберите проект:
   * Чтобы собрать все модули
   
              npm run build:all
   
   * Чтобы собрать только модуль Controls

              npm run build:basic

* Для запуска локального демо-стенда по адресу [localhost:777](http://localhost:777/) выполните:

        npm start

    Если порт 777 занят, то приложение запустится на другом свободном порту, в консоли будет ссылка

* Для запуска локального демо-стенда в режиме hot reload выполните:

        npm run start:hot

* Для запуска юнит-тестов под Node.js выполните:

        npm test
        
