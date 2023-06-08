import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn, THeader } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import 'css!DemoStand/Controls-demo';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/StickyWithGroup/StickyWithGroup';
import * as CellTmpl from 'wml!Controls-demo/gridNew/Ladder/StickyWithGroup/CellTmpl';

function getData() {
    return [
        {
            key: 1,
            date: '30.04.21',
            time: '14:32',
            name: 'Вадим',
        },
        {
            key: 2,
            date: '30.04.21',
            time: '13:52',
            name: 'Вадим',
        },
        {
            key: 3,
            date: '30.04.21',
            time: '13:53',
            name: 'Вадим',
        },
        {
            key: 4,
            date: '30.04.21',
            time: '11:45',
            name: 'Вадим',
        },
        {
            key: 5,
            date: '26.04.21',
            time: '14:32',
            name: 'Вадим',
        },
        {
            key: 6,
            date: '14.03.21',
            time: '12:33',
            name: 'Вадим',
        },
        {
            key: 7,
            date: '14.03.21',
            time: '04:02',
            name: 'Вадим',
        },
        {
            key: 8,
            date: '14.03.21',
            time: '23:32',
            name: 'Вадим',
        },
        {
            key: 9,
            date: '14.03.21',
            time: '11:34',
            name: 'Вадим',
        },
        {
            key: 10,
            date: '22.02.21',
            time: '16:32',
            name: 'Вадим',
        },
        {
            key: 11,
            date: '22.02.21',
            time: '18:00',
            name: 'Вадим',
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            template: CellTmpl,
            width: 'max-content',
            stickyProperty: ['date'],
        },
        {
            displayProperty: 'time',
            width: '150px',
        },
        {
            displayProperty: 'name',
            width: '250px',
        },
    ];
    protected _ladderProperties: string[] = ['photo', 'date'];
    protected _selectedKeys: number[] = [];
    protected _header: THeader = [{ caption: 'Дата' }, { caption: 'Время' }, { caption: 'Имя' }];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
