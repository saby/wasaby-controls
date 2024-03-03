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
            title: 'Редактировать',
            icon: 'icon-Edit',
            node: null,
        },
        {
            key: '3',
            title: 'Копировать',
            icon: 'icon-Copy',
            node: null,
        },
        {
            key: '4',
            title: 'Выгрузить',
            icon: 'icon-DownloadNew',
            node: true,
        },
        {
            key: '41',
            title: 'Файл',
            parent: '4',
        },
        {
            key: '42',
            title: 'PDF',
            parent: '4',
        },
    ],
    keyProperty: 'key',
});
