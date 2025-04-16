import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/demoVertical2/VerticalStep1';

const STEP = 0;
const srcData = [
    {
        id: 1,
        title: 'содержит вложения',
        description: '• содержит вложения',
    },
    {
        id: 2,
        title: 'Notebooks 2',
        description: '• пришел от контрагента',
    },
    {
        id: 3,
        title: 'Smartphones 3 ',
        description: '• для нашей организации',
    },
    {
        id: 4,
        title: 'Notebooks 2',
        description: '• c ключевыми словами',
    },
];
export default class VerticalStep1 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;
    protected _textInputValue: string;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: srcData,
    });

    protected _finishStepHandler(event: SyntheticEvent<Event>): void {
        this._options.finishStepHandler(event, STEP);
    }

    protected _afterMount(): void {
        this._textInputValue = this._options.textInputValue;
    }
}
