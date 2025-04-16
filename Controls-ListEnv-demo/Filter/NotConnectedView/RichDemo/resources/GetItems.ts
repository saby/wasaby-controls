export function getHierarchyData() {
    return [
        {
            id: 'Приход',
            title: 'Coming',
            parent: null,
            '@parent': true,
        },
        {
            id: 'Расход',
            title: 'Consumption',
            parent: null,
            '@parent': true,
        },
        {
            id: '11',
            title: 'The provider returns the prepayment',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '12',
            title: 'Payment from the buyer',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '21',
            title: 'Return of prepayment to the buyer',
            parent: 'Расход',
            '@parent': null,
        },
        {
            id: '22',
            title: 'Payment to the supplier',
            parent: 'Расход',
            '@parent': null,
        },
        {
            id: '23',
            title: 'Payment to the supplier 3',
            parent: 'Расход',
            '@parent': null,
        },
        {
            id: '24',
            title: '1Payment to the supplier 3',
            parent: 'Расход',
            '@parent': null,
        },
        {
            id: '13',
            title: '2Payment to the supplier 3',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '14',
            title: '3Payment to the supplier 3',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '15',
            title: '4Payment to the supplier 3',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '16',
            title: '5Payment to the supplier 3',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '17',
            title: '6Payment to the supplier 3',
            parent: 'Приход',
            '@parent': null,
        },
        {
            id: '18',
            title: '7Payment to the supplier 3',
            parent: 'Приход',
            '@parent': null,
        },
    ];
}

export function getHierarchyData2() {
    return [
        {
            id: 'Список1',
            title: 'Список 1',
            parent: null,
            '@parent': true,
        },
        {
            id: 'Список2',
            title: 'Список 2',
            parent: null,
            '@parent': true,
        },
        {
            id: '11',
            title: 'Ребенок 1',
            parent: 'Список1',
            '@parent': null,
        },
        {
            id: '12',
            title: 'Ребенок 2',
            parent: 'Список1',
            '@parent': null,
        },
        {
            id: '21',
            title: 'Ребенок 1',
            parent: 'Список2',
            '@parent': null,
        },
        {
            id: '22',
            title: 'Ребенок 2',
            parent: 'Список2',
            '@parent': null,
        },
        {
            id: '23',
            title: 'Ребенок 3',
            parent: 'Список2',
            '@parent': null,
        },
    ];
}

export function getCategoryItems() {
    return [
        { id: 1, title: 'Banking and financial services, credit' },
        { id: 2, title: 'Gasoline, diesel fuel, light oil products' },
        { id: 3, title: 'Transportation, logistics, customs' },
        { id: 4, title: 'Oil and oil products' },
        { id: 5, title: 'Pipeline transportation services' },
        {
            id: 6,
            title: 'Services in tailoring and repair of clothes, textiles',
        },
        {
            id: 7,
            title: 'Computers and components, computing, office equipment',
        },
        { id: 8, title: 'Accounting, audit' },
        { id: 9, title: 'Marketing and social research' },
        { id: 10, title: 'Locking and sealing products' },
        { id: 11, title: 'Weapons, ammunition, weapons' },
        { id: 12, title: 'Security services, security' },
        { id: 13, title: 'Storages, safes' },
        {
            id: 14,
            title: 'Books, newspapers, magazines and other products of publishing houses',
        },
        {
            id: 15,
            title: 'Equipment and raw materials for printing. Spare parts',
        },
        { id: 16, title: 'Printing Services' },
        { id: 17, title: 'Advertising, media, television' },
        { id: 18, title: 'Souvenirs' },
        { id: 19, title: 'Photo, video and sound recording services' },
        {
            id: 20,
            title: 'Rental and leasing of real estate, exchange, privatization',
        },
        {
            id: 21,
            title: 'Purchase and sale of residential and non-residential buildings, structures and premises',
        },
        { id: 22, title: 'Purchase and sale of land' },
    ];
}

export function getMultiSelectItems() {
    return [
        { id: '1', title: 'Yaroslavl' },
        { id: '2', title: 'Moscow' },
        { id: '3', title: 'St-Petersburg' },
        { id: '4', title: 'Astrahan' },
        { id: '5', title: 'Arhangelsk' },
        { id: '6', title: 'Abakan' },
        { id: '7', title: 'Barnaul' },
        { id: '8', title: 'Belgorod' },
        { id: '9', title: 'Voronezh' },
        { id: '10', title: 'Vladimir' },
        { id: '11', title: 'Bryansk' },
        { id: '12', title: 'Ekaterinburg' },
        { id: '13', title: 'Kostroma' },
        { id: '14', title: 'Vologda' },
        { id: '15', title: 'Pskov' },
        { id: '16', title: 'Kirov' },
    ];
}
