import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoVertical/VerticalStep2';
import { Memory } from 'Types/source';

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

export default class VerticalStep2 extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: srcData,
    });
    protected _viewSource2: Memory = new Memory({
        keyProperty: 'id',
        data: srcData2,
    });
    protected clickHandler(): void {
        this._notify('finishStep', [STEP]);
    }
    protected stepBackHandler(): void {
        this._notify('stepBack', [STEP]);
    }
}
