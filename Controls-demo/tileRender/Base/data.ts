import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IData } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';

export function getDataWithRealImages(count: number): IData[] {
    const res = [];
    const items = [
        {
            id: 1,
            parent: null,
            type: null,
            title: 'Мармеладки',
            image: Images.MARMELADE,
            isDocument: true,
            hiddenGroup: true,
            width: 260,
            isShadow: true,
        },
        {
            id: 2,
            parent: null,
            type: null,
            title: 'Клюква',
            image: Images.KLUKVA,
            isDocument: true,
            hiddenGroup: true,
            width: 260,
            isShadow: true,
        },
    ];

    for (let i = 0; i < count; i++) {
        const itemIndex = i % items.length; // Чередуем 0 и 1
        res.push({
            ...items[itemIndex],
            id: i,
        });
    }
    return res;
}
