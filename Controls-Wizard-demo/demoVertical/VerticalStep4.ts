import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/demoVertical/VerticalStep4';
import { Memory } from 'Types/source';

const srcData = [
    {
        id: 1,
        description: '• конкретный сотрудник или подразделение, указанное отправителем в документе',
    },
    {
        id: 2,
        description: '• обособленное подразделение, соответствующее адресу в документе',
    },
    {
        id: 3,
        description: '• ответственный за документ-основание, например, за счет или договор',
    },
    {
        id: 4,
        description: '• подразделение, соответствующее нашей организации',
    },
    {
        id: 5,
        description: '• ответственного с предыдущего документа от контрагента',
    },
];
const STEP = 3;

export default class VerticalStep4 extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: srcData,
    });
    protected clickHandler(): void {
        this._notify('finishStep', [STEP + 1]);
    }
    protected finishWizard(): void {
        this._notify('finishWizard');
    }
}
