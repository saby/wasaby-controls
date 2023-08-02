export const listData = [
    {
        id: 0,
        name: 'Александр',
        city: 'Ярославль',
    },
    {
        id: 1,
        name: 'Алексей',
        city: 'Рыбинск',
    },
    {
        id: 2,
        name: 'Дмитрий',
        city: 'Ярославль',
    },
    {
        id: 3,
        name: 'Андрей',
        city: 'Рыбинск',
    },
];

export const cityFilterData = [
    {
        city: 'Ярославль',
    },
    {
        city: 'Рыбинск',
    },
    {
        city: 'Москва',
    },
];

export const namesFilterData = [
    {
        name: 'Александр',
    },
    {
        name: 'Алексей',
    },
    {
        name: 'Дмитрий',
    },
    {
        name: 'Андрей',
    },
];

export const hierarchicalData = [
    {
        id: 1,
        node: true,
        parent: null,
        name: 'Процессоры',
    },
    {
        id: 11,
        node: true,
        parent: 1,
        name: 'AMD',
    },
    {
        id: 111,
        node: null,
        parent: 11,
        name: 'Процессор AMD Ryzen Threadripper 3990X OEM [sTRX4, 64 x 2.9 ГГц, L2 - 32 МБ, L3 - 256 МБ, 4хDDR4-3200 МГц, TDP 280 Вт]',
    },
    {
        id: 112,
        node: null,
        parent: 11,
        name: 'Процессор AMD Ryzen Threadripper PRO 3975WX BOX [sWRX8, 32 x 3.5 ГГц, L2 - 16 МБ, L3 - 128 МБ, 8хDDR4-3200 МГц, TDP 280 Вт]',
    },
    {
        id: 12,
        node: true,
        parent: 1,
        name: 'Intel',
    },
    {
        id: 121,
        node: null,
        parent: 12,
        name: 'Процессор Intel Core i9-10980XE OEM [LGA 2066, 18 x 3 ГГц, L2 - 18 МБ, L3 - 25.75 МБ, 4хDDR4-2933 МГц, TDP 165 Вт]',
    },
    {
        id: 122,
        node: null,
        parent: 12,
        name: 'Процессор Intel Core i9-10940X BOX [LGA 2066, 14 x 3.3 ГГц, L2 - 14 МБ, L3 - 19.25 МБ, 4хDDR4-2933 МГц, TDP 165 Вт]',
    },
    {
        id: 2,
        node: true,
        parent: null,
        name: 'Материнские платы',
    },
    {
        id: 21,
        node: true,
        parent: 2,
        name: 'Asrock',
    },
    {
        id: 22,
        node: true,
        parent: 2,
        name: 'ASUS',
    },
    {
        id: 23,
        node: true,
        parent: 2,
        name: 'Biostar',
    },
    {
        id: 3,
        node: true,
        parent: null,
        name: 'Видеокарты',
    },
    {
        id: 4,
        node: true,
        parent: null,
        name: 'Оперативная память',
    },
    {
        id: 5,
        node: true,
        parent: null,
        name: 'Блоки питания',
    },
];
