import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/MasterDetail/Base/Index');
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _detailSource: Memory = null;
    protected _masterSource: Memory = null;
    protected _filter: object = null;

    protected _beforeMount(): void {
        this._detailSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '0',
                    title: 'Ошибка в разработку',
                    sourceType: 'incoming',
                },
                {
                    id: '1',
                    title: 'Аттестация',
                    sourceType: 'incoming',
                },
                {
                    id: '1',
                    title: 'Задача в разработку',
                    sourceType: 'incomingTasks',
                },
            ],
        });
        this._masterSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'incoming',
                    title: 'Входящие',
                    sourceType: 'incoming',
                },
                {
                    id: 'incomingTasks',
                    title: 'Входящие задачи',
                    sourceType: 'incomingTasks',
                },
            ],
        });
    }

    protected _onMarkedKeyChanged(e: SyntheticEvent<Event>, key: number): void {
        this._filter = {
            sourceType: key,
        };
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/MasterDetail/Demo',
    ];
}
