import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Stack } from 'Controls/popup';
import * as template from 'wml!Controls-Wizard-demo/demoHorizontal/DemoHorizontal';

export default class DemoHorizontal extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        stack: Stack;
    };

    protected _afterMount(): void {
        this.openStack();
    }

    private openStack(): void {
        this._children.stack.open({
            closeOnOutsideClick: false,
            template: 'Controls-Wizard-demo/demoHorizontal/Horizontal',
            width: 900,
        });
    }
}
