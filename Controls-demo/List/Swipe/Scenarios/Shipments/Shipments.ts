import { Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/Shipments';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/firstColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/secondColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/thirdColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fourthColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fifthColumn';
import 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/sixthColumn';

const columns = [
    {
        template: 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/firstColumn',
    },
    {
        template: 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/secondColumn',
    },
    {
        template: 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/thirdColumn',
        align: 'right',
    },
    {
        template: 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fourthColumn',
    },
    {
        template: 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/fifthColumn',
    },
    {
        template: 'wml!Controls-demo/List/Swipe/Scenarios/Shipments/sixthColumn',
        align: 'right',
    },
];

const itemActions = [
    {
        id: 0,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: 1,
    },
    {
        id: 1,
        icon: 'icon-DK',
        title: 'Расчеты по документу',
        showType: 1,
    },
];

function getData() {
    return [
        {
            id: 0,
            date: '19.06.18',
            additionalText: '...14567',
            title: 'Тандер, АО (Магнит)',
            additionalInfo: ['Комментарий из документа', 'Набор художника', 'Краски ПФ-111', '...'],
            orgNames: ['Основной склад', 'Фаворит, ООО'],
            sum: 8700,
            regulationName: 'Реализация',
            author: 'Никитина О.В.',
        },
        {
            id: 1,
            date: '07.06.18',
            additionalText: '...10005',
            title: 'Основа, ООО',
            orgNames: ['Основной склад', 'Мили, ООО'],
            regulationName: 'Реализация',
            author: 'Можалойвская Л.А.',
        },
    ];
}

export default class Shipments extends Control {
    protected _template: Function = template;
    protected _itemActions: object[] = itemActions;
    protected _columns: object[] = columns;

    static _styles: string[] = ['Controls-demo/List/Swipe/Scenarios/Shipments/Shipments'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SwipeShipment: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
        };
    }
}
