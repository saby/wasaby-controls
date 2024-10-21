import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Stack } from 'Controls/popup';
import * as template from 'wml!Controls-Wizard-demo/demoVertical/VerticalWithStack';

export default class VerticalWithStack extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _afterMount(): void {
        this.openStack();
    }

    private openStack(): void {
        Stack.openPopup({
            closeOnOutsideClick: false,
            template: 'Controls-Wizard-demo/demoVertical/Vertical',
            width: 900,
            opener: this,
        });
    }
}
