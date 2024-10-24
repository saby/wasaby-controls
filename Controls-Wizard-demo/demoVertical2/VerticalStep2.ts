import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/demoVertical2/VerticalStep2';

const STEP = 1;
const srcData = [
    {
        id: 1,
        description: '• Поступление товаров и услуг',
    },
    {
        id: 2,
        description: '• Счет',
    },
    {
        id: 3,
        description: '• Письмо',
    },
    {
        id: 4,
        description: '• Входящий договор',
    },
];
const srcData2 = [
    {
        id: 1,
        description: '• отклонить',
    },
];

export default class VerticalStep2 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: srcData,
    });
    protected _viewSource2: Memory = new Memory({
        keyProperty: 'id',
        data: srcData2,
    });
    protected _finishStepHandler(event: SyntheticEvent<Event>): void {
        this._options.finishStepHandler(event, STEP);
    }

    protected _stepBackHandler(event: SyntheticEvent<Event>): void {
        this._options.stepBackHandler(event, STEP);
    }
}
