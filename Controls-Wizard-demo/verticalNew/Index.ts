import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/verticalNew/Index';
import { Controller, IValidateResult } from 'Controls/validate';
import 'css!Controls-Wizard-demo/verticalNew/Index';
import { IWizardItem } from 'Controls-Wizard/verticalNew';
import { items } from 'Controls-Wizard-demo/verticalNew/resources/WizardItems';

export default class VerticalNewBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _currentStepIndex: number = 0;
    protected _mode: string = 'edit';
    protected _items: IWizardItem[] = items;

    protected _getSaveButtonVisible(): boolean {
        return this._selectedStepIndex === 4 && this._mode !== 'view';
    }

    protected _onSave(): void {
        (this._children.validateController as Controller)
            .submit()
            .then((result: IValidateResult) => {
                if (!result.hasErrors) {
                    this._mode = 'view';
                }
            });
    }
}
