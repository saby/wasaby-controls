import { IJSONML } from 'Types/entity';
import { Memory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Decorators/Markup/WithControls/MarkupWithControls';
import 'css!Controls-demo/Decorators/Markup/Markup';

export default class TableOfContents extends Control {
    protected _template: TemplateFunction = template;
    protected _value: IJSONML = [
        ['p', 'Поле ввода1:', ['component:inputControl', { value: '123', id: 'input1' }]],
        ['p', 'Поле ввода2:', ['component:inputControl', { value: '345', id: 'input2' }]],
    ];
    protected _inputValue: string = 'текст';
    protected _inputID: number;
    protected _date: Date = new Date(2021, 0, 1);
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: [
            {
                id: '1',
                title: 'Item1',
            },
            {
                id: '2',
                title: 'Item2',
            },
            {
                id: '3',
                title: 'Item3',
            },
            {
                id: '4',
                title: 'Item4',
            },
            {
                id: '5',
                title: 'Item5',
            },
        ],
    });

    protected _inputDataChangedHandler(event: Event, id: number, value: string): void {
        this._inputValue = value;
        this._inputID = id;
    }
}
