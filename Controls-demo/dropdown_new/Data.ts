import { RecordSet } from 'Types/collection';

export const companies = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Наша компания',
            city: null,
        },
        {
            key: '2',
            title: 'Все юридические лица',
            city: null,
        },
        {
            key: '3',
            title: 'Инори, ООО',
            city: 'г. Ярославль',
        },
        {
            key: '4',
            title: '"Компания "Тензор" ООО',
            city: 'г. Ярославль',
        },
        {
            key: '5',
            title: 'Ромашка, ООО',
            city: 'г. Москва',
        },
        {
            key: '6',
            title: 'Сбербанк-Финанс, ООО',
            city: 'г. Пермь',
        },
        {
            key: '7',
            title: 'Петросоюз-Континент, ООО',
            city: 'г. Самара',
        },
        {
            key: '8',
            title: 'Альфа Директ сервис, ОАО',
            city: 'г. Москва',
        },
        {
            key: '9',
            title: 'АК "ТРАНСНЕФТЬ", ОАО',
            city: 'г. Москва',
        },
        {
            key: '10',
            title: 'Иванова Зинаида Михайловна, ИП',
            city: 'г. Ярославль',
        },
    ],
    keyProperty: 'key',
});

export const tasks = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Задача',
            node: null,
        },
        {
            key: '2',
            title: 'Ошибка',
            node: null,
        },
        {
            key: '3',
            title: 'Поручение отделам',
            node: true,
        },
        {
            key: '4',
            title: 'Разработка',
            node: true,
        },
        {
            key: '5',
            title: 'Продажи',
            node: true,
        },
        {
            key: '6',
            title: 'Маркетинг',
            node: true,
        },
        {
            key: '7',
            title: 'Юридические вопросы',
            node: true,
        },
        {
            key: '8',
            title: 'Задача',
            node: true,
        },
        {
            key: '9',
            title: 'Задача',
            node: true,
        },
        {
            key: '10',
            title: 'Задача',
            node: true,
        },
        {
            key: '11',
            title: 'Задача',
            node: true,
        },
        {
            key: '12',
            title: 'Задача',
            node: true,
        },
    ],
    keyProperty: 'key',
});

export const cities = new RecordSet({
    rawData: [
        { key: 1, title: 'Ярославль' },
        { key: 2, title: 'Москва' },
        { key: 3, title: 'Санкт-Петербург' },
    ],
    keyProperty: 'key',
});

export const actionsSmall = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Распечатать',
            icon: 'icon-Print',
            node: null,
        },
        {
            key: '2',
            title: 'Выгрузить',
            icon: 'icon-DownloadNew',
            node: true,
        },
        {
            key: '3',
            title: 'Копировать',
            icon: 'icon-Copy',
            node: null,
        },
    ],
});

export const actionsSmallWithHierarchy = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Распечатать',
            icon: 'icon-Print',
            node: null,
        },
        {
            key: '2',
            title: 'Выгрузить',
            icon: 'icon-DownloadNew',
            node: true,
        },
        {
            key: '3',
            title: 'Копировать',
            icon: 'icon-Copy',
            node: null,
        },
        {
            key: '21',
            title: 'PDF',
            parent: '2',
        },
        {
            key: '22',
            title: 'Excel',
            parent: '2',
        },
    ],
});

export const actions = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Распечатать',
            icon: 'icon-Print',
            node: null,
        },
        {
            key: '2',
            title: 'Загрузить',
            icon: 'icon-UnloadNew',
            node: true,
        },
        {
            key: '3',
            title: 'Выгрузить',
            icon: 'icon-DownloadNew',
            node: true,
        },
        {
            key: '4',
            title: 'Копировать',
            icon: 'icon-Copy',
            node: null,
        },
        {
            key: '5',
            title: 'Редактировать',
            icon: 'icon-Edit',
            node: null,
        },
        {
            key: '6',
            title: 'Удалить',
            icon: 'icon-Erase',
            iconStyle: 'danger',
            node: null,
        },
        {
            key: '21',
            title: 'Из файла',
            parent: '2',
        },
        {
            key: '22',
            title: 'По шаблону',
            parent: '2',
        },
        {
            key: '31',
            title: 'Файл',
            parent: '3',
        },
        {
            key: '32',
            title: 'PDF',
            parent: '3',
        },
        {
            key: '33',
            title: 'Excel',
            parent: '3',
        },
        {
            key: '34',
            title: 'В 1С',
            parent: '3',
        },
        {
            key: '35',
            title: 'На диск',
            parent: '3',
        },
    ],
    keyProperty: 'key',
});

export const hierarchyTasks = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Разработка',
            node: true,
            parent: null,
        },
        {
            key: '2',
            title: 'Поручение отделам',
            node: true,
            parent: null,
        },
        {
            key: '3',
            title: 'Продажи',
            node: true,
            parent: null,
        },
        {
            key: '4',
            title: 'Обучение и аттестация',
            node: null,
            parent: null,
        },
        {
            key: '100',
            title: 'Папка',
            node: null,
            parent: null,
        },
        {
            key: '11',
            title: 'Задача в разработку',
            node: null,
            parent: '1',
        },
        {
            key: '12',
            title: 'Ошибка',
            node: null,
            parent: '1',
        },
        { key: '13', title: 'Merge request', parent: '1' },
        {
            key: '14',
            title: 'Работы на стендах',
            parent: '1',
            node: true,
        },
        { key: '15', title: 'Проектирование', parent: '1', node: true },
        { key: '16', title: 'Фиксация веток в репозитории', parent: '1' },
        { key: '141', title: 'Выполнить на рабочем', parent: '14' },
        { key: '142', title: 'Блокировка сервиса', parent: '14' },
        { key: '143', title: 'Разворот нового сервиса/приложения', parent: '14' },
        { key: '144', title: 'Авария на тестовом стенде', parent: '14' },
        { key: '151', title: 'Согласование макета', parent: '15' },
        { key: '152', title: 'Согласование тем оформления', parent: '15' },
        {
            key: '21',
            title: 'Поручение',
            parent: '2',
            node: null,
        },
        { key: '22', title: 'Согласование', parent: '2' },
        { key: '31', title: 'Работа с клиентской базой', parent: '3' },
        { key: '32', title: 'Взаимодействие с партнерами', parent: '3' },
        { key: '33', title: 'Организация продаж', parent: '3', node: true },
        { key: '331', title: 'Изменение прайса', parent: '33' },
        { key: '332', title: 'Согласование имени отправителя sms-рассылок', parent: '33' },
    ],
    keyProperty: 'key',
});
