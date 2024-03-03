export const getData = () => {
    return [
        {
            key: 1,
            title: 'Apple',
            country: 'США',
            rating: '8.5',
            parent: null,
            type: true,
            hasChild: true,
            group: 'склад 1',
        },
        {
            key: 11,
            title: 'Smartphones1',
            parent: 1,
            rating: '9.2',
            type: true,
            hasChild: true,
            group: 'склад 1',
        },
        {
            key: 12,
            title: 'Smartphones2',
            parent: 1,
            rating: '9.2',
            type: true,
            hasChild: true,
            group: 'склад 1',
            href: 'https://www.apple.com/shop/buy-iphone/iphone-14',
        },
        {
            key: 13,
            title: 'Smartphones3',
            parent: 1,
            rating: '9.2',
            type: true,
            hasChild: true,
            group: 'склад 1',
        },
        {
            key: 14,
            title: 'Smartphones4',
            parent: 1,
            rating: '9.2',
            type: true,
            hasChild: true,
            group: 'склад 1',
        },
        {
            key: 15,
            title: 'Smartphones5',
            parent: 1,
            rating: '9.2',
            type: true,
            hasChild: true,
            group: 'склад 1',
            href: 'https://www.apple.com/iphone-15-pro/',
        },
        {
            key: 151,
            title: 'iPhone 4s',
            rating: '9.5',
            parent: 15,
            type: null,
            group: 'склад 1',
        },
        {
            key: 152,
            title: 'iPhone 4',
            rating: '8.9',
            parent: 15,
            type: null,
            group: 'склад 1',
        },
        {
            key: 153,
            title: 'iPhone X Series',
            rating: '7.6',
            parent: 15,
            type: false,
            group: 'склад 1',
        },
        {
            key: 1531,
            title: 'iPhone Xs',
            rating: '7.4',
            parent: 153,
            type: null,
            group: 'склад 1',
        },
        {
            key: 1532,
            title: 'iPhone Xs Max',
            rating: '6.8',
            parent: 153,
            type: null,
            group: 'склад 1',
        },
        {
            key: 1533,
            title: 'iPhone XR',
            rating: '7.1',
            parent: 153,
            type: null,
            group: 'склад 1',
        },
        {
            key: 16,
            title: 'Notebooks',
            parent: 1,
            rating: '9.4',
            type: false,
            group: 'склад 1',
        },
        {
            key: 161,
            title: 'MacBook Pro',
            rating: '7.2',
            modelId: 'MacBookPro15,4',
            size: '13 дюймов',
            year: '2019',
            note: '2 порта Thunderbolt 3',
            parent: 16,
            type: null,
            group: 'склад 1',
            href: 'https://www.apple.com/macbook-pro/',
        },
        {
            key: 162,
            title: 'MacBook Pro',
            modelId: 'MacBookPro15,3',
            rating: '6.9',
            size: '15 дюймов',
            year: '2019',
            note: '',
            parent: 16,
            type: null,
            group: 'склад 1',
        },
        {
            key: 163,
            title: 'MacBook Pro',
            modelId: 'MacBookPro15,2',
            size: '13 дюймов',
            rating: '9.1',
            year: '2019',
            note: '4 порта Thunderbolt 3',
            parent: 16,
            type: null,
            group: 'склад 1',
        },
        {
            key: 164,
            title: 'MacBook Pro',
            modelId: 'MacBookPro14,3',
            rating: '8.8',
            size: '15 дюймов',
            year: '2017',
            note: '',
            parent: 16,
            type: null,
            group: 'склад 1',
        },
        {
            key: 165,
            title: 'MacBook Pro',
            modelId: 'MacBookPro14,2',
            size: '13 дюймов',
            rating: '8.5',
            year: '2017',
            note: '4 порта Thunderbolt 3',
            parent: 16,
            type: null,
            group: 'склад 1',
        },
        {
            key: 17,
            title: 'Magic Mouse 2',
            modelId: 'MM16',
            rating: '7.2',
            year: '2016',
            parent: 1,
            type: null,
            group: 'склад 1',
        },
        {
            key: 2,
            title: 'Samsung',
            country: 'Южная Корея',
            rating: '8.0',
            parent: null,
            type: true,
            hasChild: true,
            group: 'склад 2',
        },
        {
            key: 21,
            title: 'Samusng A10',
            rating: '9.5',
            parent: 2,
            type: null,
            group: 'склад 2',
        },
        {
            key: 22,
            title: 'Samsung A20',
            rating: '9.5',
            parent: 2,
            type: null,
            group: 'склад 2',
            href: 'https://www.samsung.com/ru/',
        },
        {
            key: 23,
            title: 'Samsung A30',
            rating: '9.5',
            parent: 2,
            type: null,
            group: 'склад 2',
        },
        {
            key: 24,
            title: 'Samsung A40',
            rating: '9.5',
            parent: 2,
            type: null,
            group: 'склад 2',
        },
        {
            key: 3,
            title: 'Meizu',
            rating: '7.5',
            country: 'КНР',
            parent: null,
            type: true,
            group: 'склад 2',
        },
        {
            key: 4,
            title: 'Asus',
            rating: '7.3',
            country: 'Тайвань',
            parent: null,
            type: false,
            group: 'склад 3',
        },
        {
            key: 5,
            title: 'Acer',
            rating: '7.1',
            country: 'Тайвань',
            parent: null,
            type: false,
            group: 'склад 3',
            href: 'https://www.acer.com/ru-ru',
        },
    ];
};

export const newGetData = () => {
    const result = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
        const rootItemKey = `Отдел_${i}`;
        const rootItem = _getItem(null, rootItemKey, 9, i);
        result.push(rootItem);

        for (let j = 0; j < Math.ceil(count / 10); j++) {
            result.push(_getItem(rootItemKey, `Сотрудник_${i}_${j}`, 9, j));
        }
    }

    return result;
};

const _getItem = (rootKey: string | null, key: string, columnsCount: number, rootNum: number) => {
    const rootItem = {
        key,
        parent: rootKey,
        type: rootKey === null ? true : null,
        title: `${key}`,
        hasPhoto: rootKey !== null,
    };
    const titles = [
        'Долг',
        'Запланировано',
        'Сделано',
        'НеСделано',
        'СделаноПроцент',
        'НеСделаноПроцент',
        'Перенесено',
        'ПеренесеноПроцент',
        'ВнеПлана',
    ];
    for (let j = 0; j < columnsCount - 1; j++) {
        rootItem[`${titles[j]}`] = Math.abs((Math.cos(j) + Math.sin(rootNum)) * 100).toFixed(2);
    }
    return rootItem;
};

export const getColumns = () => {
    const result = [];
    const titles = ['Долг', 'Запланировано', 'Сделано'];
    result.push({
        displayProperty: 'title',
        width: 'auto',
        columnSeparatorSize: {
            right: 's',
        },
    });
    for (let i = 0; i < 3; i++) {
        result.push({
            displayProperty: `${titles[i]}`,
            width: '100px',
        });
    }
    return result;
};

export const getHeader = () => {
    return [
        {
            key: '1',
            caption: '',
            startRow: 1,
            endRow: 2,
            startColumn: 1,
            endColumn: 2,
        },
        {
            key: '2',
            caption: 'На начало',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 3,
        },
        {
            key: '3',
            caption: 'Запланировано',
            startRow: 1,
            endRow: 2,
            startColumn: 3,
            endColumn: 4,
        },
        {
            key: '4',
            caption: 'Сделано',
            startRow: 1,
            endRow: 2,
            startColumn: 4,
            endColumn: 5,
        },
    ];
};
