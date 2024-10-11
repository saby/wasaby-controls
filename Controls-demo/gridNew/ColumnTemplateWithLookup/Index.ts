import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnTemplateWithLookup/Index';
import * as columnTemplate from 'wml!Controls-demo/gridNew/ColumnTemplateWithLookup/ColumnTemplate';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IColumn } from 'Controls/grid';

const lookupItems = new RecordSet({
    rawData: [
        {
            id: 1,
            title: 'Разработка',
            department: 'Разработка',
            owner: 'Новиков Д.В.',
        },
        {
            id: 2,
            title: 'Продвижение СБИС',
            department: 'Продвижение СБИС',
            owner: 'Кошелев А.Е.',
        },
        {
            id: 4,
            title: 'Продвижение СБИС',
            department: 'Продвижение СБИС',
            owner: 'Кошелев А.Е.',
        },
        {
            id: 3,
            title: 'Федеральная клиентская служка',
            department: 'Федеральная клиентская служка',
            owner: 'Мануйлова Ю.А.',
        },
    ],
    keyProperty: 'id',
});

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        { displayProperty: 'country', width: '150px' },
        { template: columnTemplate },
    ];

    static getLoadConfig(): unknown {
        return {
            ColumnTemplateWithLookup: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            {
                                key: 0,
                                country: 'Россия',
                                lookupItems,
                                lookupSelectedKeys: [1, 2, 3, 4],
                            },
                            {
                                key: 1,
                                country: 'Канада',
                                lookupItems,
                                lookupSelectedKeys: [1, 2, 3, 4],
                            },
                        ],
                    }),
                    keyProperty: 'key',
                },
            },
        };
    }
}
