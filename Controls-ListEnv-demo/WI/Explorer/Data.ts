import { GadgetsImages } from 'Controls-ListEnv-demo/DemoData/images/gadgets';
import { BrandsImages } from 'Controls-ListEnv-demo/DemoData/images/brands';

interface IListItem {
    country: string;
    title: string;
    available: string;
    type?: string;
    company?: string;
    primaryCompany?: string;
    screenType?: string;
    id: number | string;
    inStock?: boolean;
    parent?: any;
    node?: boolean;
    image?: string;
}

function getCurrentKeyGetter(maxLength: number) {
    let next = 0;
    return () => {
        if (next === maxLength) {
            next = 0;
        }
        return next++;
    };
}

export function getFlatList(country: string[], countInStock: number): IListItem[] {
    const items = [
        {
            country: 'США',
            title: 'США',
            available: 'Есть в наличии',
            id: '1',
            inStock: true,
            parent: null,
            node: true,
            image: BrandsImages.acer,
        },
        {
            country: 'Южная Корея',
            title: 'Южная Корея',
            available: 'Есть в наличии',
            id: '2',
            inStock: true,
            parent: null,
            node: true,
            image: BrandsImages.asus,
        },
        {
            country: 'Тайвань',
            title: 'Тайвань',
            available: 'Есть в наличии',
            id: '3',
            inStock: true,
            parent: null,
            node: true,
            image: BrandsImages.apple,
        },
    ] as IListItem[];
    const GadgetsImagesKeys = Object.keys(GadgetsImages);
    const getCurrentKey = getCurrentKeyGetter(GadgetsImagesKeys.length);
    country.forEach((countryName) => {
        const parent = new Map([
            ['США', 1],
            ['Южная Корея', 2],
            ['Тайвань', 3],
            ['Калифорния', 4],
        ]);
        for (let i = 0; i < countInStock; i++) {
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Есть в наличии',
                type: 'Ноутбуки',
                company: 'Samsung',
                primaryCompany: 'Samsung',
                screenType: 'IPS',
                id: `${parent.get(countryName)}_laptop_${i}`,
                inStock: true,
                parent: String(parent.get(countryName)),
                node: null,
                image: GadgetsImages[GadgetsImagesKeys[getCurrentKey()]],
            });
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Нет в наличии',
                type: 'ПК',
                company: 'Apple',
                primaryCompany: 'Apple',
                screenType: 'OLED',
                id: `${parent.get(countryName)}_pc_${i}`,
                inStock: false,
                parent: null,
                node: null,
                image: GadgetsImages[GadgetsImagesKeys[getCurrentKey()]],
            });
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Есть в наличии',
                type: 'Телевизоры',
                company: 'Xiaomi',
                primaryCompany: 'Xiaomi',
                screenType: 'SVA',
                id: `${parent.get(countryName)}_tv_${i}`,
                inStock: true,
                parent: null,
                node: null,
                image: GadgetsImages[GadgetsImagesKeys[getCurrentKey()]],
            });
        }
    });

    return [items[0], ...getCaliforniaFolder(), ...items.slice(1)];
}

function getCaliforniaFolder(): IListItem[] {
    const items: IListItem[] = [];
    const BrandsImagesKeys = Object.keys(BrandsImages);
    const getCurrentKey = getCurrentKeyGetter(BrandsImagesKeys.length);
    items.push({
        country: 'США',
        title: 'Калифорния',
        available: 'Есть в наличии',
        id: '4',
        inStock: true,
        parent: null,
        node: true,
        image: BrandsImages.samsung,
    });
    [...Array(3)].forEach((item) => {
        items.push({
            country: 'США',
            title: `Товар из Калифорни номер ${items.length}`,
            available: 'Есть в наличии',
            type: 'Ноутбуки',
            company: 'Samsung',
            primaryCompany: 'Samsung',
            screenType: 'IPS',
            id: `4_laptop_${items.length}`,
            inStock: true,
            parent: '4',
            node: null,
            image: BrandsImages[BrandsImagesKeys[getCurrentKey()]],
        });
    });
    return items;
}
