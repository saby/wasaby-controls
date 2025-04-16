export const CLOTHES = [
    {
        id: 10,
        title: 'Блузка с бантом',
    },
    {
        id: 11,
        title: 'Брюки прямого края с длинным названием',
    },
    {
        id: 12,
        title: 'Джемпер',
    },
    {
        id: 13,
        title: 'Джинсы',
    },
    {
        id: 14,
        title: 'Жакет однобортный',
    },
    {
        id: 15,
        title: 'Рубашка в клетку',
    },
    {
        id: 16,
        title: 'Свитер оверсайз',
    },
];

export const SHOES = [
    {
        id: 0,
        title: 'Балетки',
        discount: false,
    },
    {
        id: 1,
        title: 'Босоножки',
        discount: false,
    },
    {
        id: 2,
        title: 'Вязаные полусапоги',
        discount: true,
    },
    {
        id: 3,
        title: 'Замшевые босоножки',
        discount: true,
    },
    {
        id: 4,
        title: 'Замшевые туфли',
        discount: true,
    },
    {
        id: 5,
        title: 'Кеды',
        discount: false,
    },
    {
        id: 6,
        title: 'Кожанные сандали с длинным названием в окне выбора',
        discount: false,
    },
];

export const HIERARCHY_SHOES = [
    {
        id: 0,
        title: 'Демисезонная',
        parent: null,
        'parent@': true,
        discount: true,
    },
    {
        id: 1,
        title: 'Зимняя',
        parent: null,
        'parent@': true,
        discount: false,
    },
    {
        id: 2,
        title: 'Летняя',
        parent: null,
        'parent@': true,
        discount: false,
    },
    {
        id: 3,
        title: 'Балетки',
        parent: 2,
        'parent@': null,
        discount: true,
    },
    {
        id: 4,
        title: 'Босоножки',
        parent: 2,
        'parent@': null,
        discount: false,
    },
    {
        id: 5,
        title: 'Вязаные полусапоги',
        parent: 0,
        'parent@': null,
        discount: false,
    },
    {
        id: 6,
        title: 'Замшевые босоножки',
        parent: 0,
        'parent@': null,
        discount: true,
    },
    {
        id: 7,
        title: 'Замшевые туфли',
        parent: 0,
        'parent@': null,
        discount: false,
    },
    {
        id: 8,
        title: 'Сапоги',
        parent: 1,
        'parent@': null,
        discount: false,
    },
    {
        id: 9,
        title: 'Ботинки',
        parent: 1,
        'parent@': null,
        discount: false,
    },
    {
        id: 10,
        title: 'Кеды',
        parent: null,
        'parent@': null,
        discount: false,
    },
    {
        id: 11,
        title: 'Кожанные сандали',
        parent: null,
        'parent@': null,
        discount: true,
    },
];
