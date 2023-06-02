interface IListItem {
    country: string;
    title: string;
    available: string;
    type?: string;
    company?: string;
    primaryCompany?: string;
    screenType?: string;
    id: number|string;
    inStock?: boolean;
    parent?: any;
    node?: boolean;
}

export function getFlatList(
    country: string[],
    countInStock: number
): IListItem[] {
    const items = [
        {
            country: 'США',
            title: 'США',
            available: 'Есть в наличии',
            id: 1,
            inStock: true,
            parent: null,
            node: true,
        },
        {
            country: 'Южная Корея',
            title: 'Южная Корея',
            available: 'Есть в наличии',
            id: 2,
            inStock: true,
            parent: null,
            node: true,
        },
        {
            country: 'Тайвань',
            title: 'Тайвань',
            available: 'Есть в наличии',
            id: 3,
            inStock: true,
            parent: null,
            node: true,
        },
    ] as IListItem[];
    country.forEach((countryName) => {
        const parent =
            countryName === 'США' ? 1 : countryName === 'Тайвань' ? 3 : 2;
        for (let i = 0; i < countInStock; i++) {
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Есть в наличии',
                type: 'Ноутбуки',
                company: 'Samsung',
                primaryCompany: 'Samsung',
                screenType: 'IPS',
                id: `${parent}_laptop_${i}`,
                inStock: true,
                parent,
                node: null,
            });
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Нет в наличии',
                type: 'ПК',
                company: 'Apple',
                primaryCompany: 'Apple',
                screenType: 'OLED',
                id: `${parent}_pc_${i}`,
                inStock: false,
                parent: null,
                node: null,
            });
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Есть в наличии',
                type: 'Телевизоры',
                company: 'Xiaomi',
                primaryCompany: 'Xiaomi',
                screenType: 'SVA',
                id: `${parent}_tv_${i}`,
                inStock: true,
                parent: null,
                node: null,
            });
        }
    });
    return items;
}
