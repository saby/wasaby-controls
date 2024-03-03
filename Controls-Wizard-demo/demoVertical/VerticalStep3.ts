import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoVertical/VerticalStep3';
import { Memory } from 'Types/source';

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
export default class VerticalStep3 extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: srcData,
    });
    protected clickHandler(): void {
        this._notify('finishStep', [STEP]);
    }

    protected finishWizardHandler(): void {
        this._notify('finishWizard');
    }
}
