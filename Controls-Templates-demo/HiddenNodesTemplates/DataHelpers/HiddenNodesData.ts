import { IColumn, IHeaderCell } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import {
    CountItems,
    ChipsItems,
    HiddenItems,
    HiddenNodesModel,
    HeaderColumn,
} from 'Controls-Templates/hiddenNodesTemplate';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

const gridDataArray = [
    getModelRecord({
        key: 4,
        parent: null,
        title: 'Подарочные сертификаты',
        hasChild: true,
        type: true,
        Prices: null,
        Counts: null,
    }),
    getModelRecord({
        key: 5,
        parent: 4,
        title: 'Электронные сертификаты',
        hasChild: true,
        type: true,
        Prices: null,
        Counts: null,
    }),
    getModelRecord({
        key: 6,
        parent: 5,
        title: 'Подарочный сертификат',
        type: null,
        Prices: [2300500],
        Counts: [1],
        sum: null,
    }),
    getModelRecord({
        key: 7,
        parent: 5,
        title: 'Сертификат на групповые занятия',
        type: null,
        Prices: [1450000, 3000, 4900, 12],
        Counts: [12, 3, 42, 1],
        sum: null,
    }),
    getModelRecord({
        key: 8,
        parent: 5,
        title: 'Сертификат Platinum на групповые занятия',
        type: null,
        Prices: [1000, 2000, 3000, 4000, 5000, 6000],
        Counts: [8, 2, 4, 3, 34, 12],
        sum: null,
    }),
    getModelRecord({
        key: 9,
        parent: 4,
        title: 'Пластиковые сертификаты',
        hasChild: true,
        type: true,
        Prices: null,
        Counts: null,
    }),
    getModelRecord({
        key: 10,
        parent: 9,
        title: 'Сертификат Platinum в тренажёрный зал / Бассейн / SPA',
        type: null,
        Prices: [2500],
        Counts: [4],
        sum: null,
    }),
    getModelRecord({
        key: 11,
        parent: 9,
        title: 'Сертификат Gold в тренажёрный зал / Бассейн / SPA',
        type: null,
        Prices: [2500],
        Counts: [2],
        sum: null,
    }),
    getModelRecord({
        key: 12,
        parent: 9,
        title: 'Сертификат Red в тренажёрный зал / Бассейн / SPA',
        type: null,
        Prices: [2500],
        Counts: [8],
        sum: null,
    }),
];

const data = new RecordSet({
    adapter: 'adapter.sbis',
});

export const gridData = {
    getData: () => {
        gridDataArray.forEach((item) => {
            return data.add(item);
        });
        return new Memory({
            data: data.getRawData(),
            keyProperty: 'key',
            adapter: data.getAdapter(),
            model: HiddenNodesModel,
        });
    },
    getColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'title',
                template: ChipsItems,
                width: 'auto',
            },
            {
                displayProperty: 'price',
                template: HiddenItems,
                align: 'right',
                width: 'auto',
            },
            {
                displayProperty: 'count',
                template: CountItems,
                width: '2fr',
            },
            {
                displayProperty: 'sum',
            },
        ];
    },
    getHeader: (): IHeaderCell[] => {
        return [
            { caption: '' },
            { caption: 'Цена', align: 'right', template: HeaderColumn },
            { caption: 'Остаток' },
            { caption: 'Сумма остатка' },
        ];
    },
    getItemActions: (): IItemAction[] => {
        return [
            { id: 1, title: 'DNS' },
            { id: 2, title: 'M.Video' },
            { id: 3, title: 'Citilink' },
            { id: 4, title: 'Eldorado' },
            { id: 5, title: 'Wildberries' },
            { id: 6, title: 'Ozon' },
        ];
    },
};

function getModelRecord(opt: object) {
    const model = new Model({
        adapter: 'adapter.sbis',
        format: [
            { name: 'parent', type: 'integer' },
            { name: 'key', type: 'integer' },
            { name: 'title', type: 'string' },
            { name: 'type', type: 'boolean' },
            { name: 'hasChild', type: 'boolean' },
            { name: 'Prices', type: 'array', kind: 'integer' },
            { name: 'Counts', type: 'array', kind: 'integer' },
            { name: 'sum', type: 'integer' },
            { name: 'isExpandedFlag', type: 'boolean', defaultValue: false },
        ],
    });

    model.set(opt);

    return model;
}
