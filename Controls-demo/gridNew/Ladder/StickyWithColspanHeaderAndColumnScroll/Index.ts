import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import 'css!DemoStand/Controls-demo';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/StickyWithColspanHeaderAndColumnScroll/Template';
import * as CellTmpl from 'wml!Controls-demo/gridNew/Ladder/StickyWithColspanHeaderAndColumnScroll/CellTmpl';

interface IStickyLadderColumn {
    template: string;
    width: string;
    stickyProperty?: string;
    resultTemplate?: TemplateFunction;
}
interface IStickyLadderHeader {
    title?: string;
}

const DATA = [
    {
        key: 1,
        date: '30.04.21',
        time: '14:32',
        total: '1300:10',
        name: 'Андрей',
    },
    {
        key: 2,
        date: '30.04.21',
        time: '13:52',
        total: '200:15',
        name: 'Борис',
    },
    {
        key: 3,
        date: '30.04.21',
        time: '13:53',
        total: '10:00',
        name: 'Вадим',
    },
    {
        key: 4,
        date: '30.04.21',
        time: '11:45',
        total: '19:59',
        name: 'Георгий',
    },
    {
        key: 5,
        date: '26.04.21',
        time: '14:32',
        total: '34:24',
        name: 'Дмитрий',
    },
    {
        key: 6,
        date: '14.03.21',
        time: '12:33',
        total: '52:10',
        name: 'Егор',
    },
    {
        key: 7,
        date: '14.03.21',
        time: '04:02',
        total: '43:39',
        name: 'Жерар',
    },
    {
        key: 8,
        date: '14.03.21',
        time: '23:32',
        total: '15:15',
        name: 'Зинаида',
    },
    {
        key: 9,
        date: '14.03.21',
        time: '11:34',
        total: '12:29',
        name: 'Инна',
    },
    {
        key: 10,
        date: '22.02.21',
        time: '16:32',
        total: '222:22',
        name: 'Кирилл',
    },
    {
        key: 11,
        date: '22.02.21',
        time: '18:00',
        total: '100:10',
        name: 'Леонид',
    },
];
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: object[] = [
        {
            template: CellTmpl,
            width: '150px',
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
        {
            displayProperty: 'total',
            width: '250px',
        },
    ];
    protected _ladderProperties: string[] = ['date'];
    protected _selectedKeys: number[] = [];
    protected _header: object[] = [
        { title: 'Первый визит', startColumn: 1, endColumn: 3 },
        { title: 'Имя', startColumn: 3, endColumn: 4 },
        { title: 'Общее время', startColumn: 4, endColumn: 5 },
    ];

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: DATA,
        });
    }
}
