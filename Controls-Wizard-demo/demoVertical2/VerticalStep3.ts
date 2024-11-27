import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/demoVertical2/VerticalStep3';

const STEP = 2;
const srcData = [
    {
        id: 1,
        description: '• конкретного сотрудника',
    },
    {
        id: 2,
        description: '• конкретный сотрудник или подразделение, указанное отправителем в документе',
    },
    {
        id: 3,
        description: '• сотрудник, закрепленный за контрагентом',
    },
    {
        id: 4,
        description: '• обособленное подразделение, соответствующее адресу в документе',
    },
    {
        id: 5,
        description: '• ответственный за документ-основание, например, за счет или договор',
    },
    {
        id: 6,
        description: '• подразделение, соответствующее нашей организации',
    },
    {
        id: 7,
        description: '• ответственного с предыдущего документа от контрагента',
    },
];

export default class VerticalStep3 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: srcData,
    });

    protected _finishStepHandler(event: SyntheticEvent<Event>): void {
        this._options.finishStepHandler(event, STEP);
    }

    protected _stepBackHandler(event: SyntheticEvent<Event>): void {
        this._options.stepBackHandler(event, STEP);
    }

    protected _finishWizardHandler(event: SyntheticEvent<Event>): void {
        this._options.finishWizardHandler(event, STEP);
    }
}
