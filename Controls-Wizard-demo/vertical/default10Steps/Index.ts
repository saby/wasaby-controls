import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/vertical/default10Steps/Template';
import * as contentTemplate from 'wml!Controls-Wizard-demo/common/step/Simple';

export default class VerticalBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedStepIndex: number = 0;
    protected _items: object[] = [];

    protected _beforeMount(options: IControlOptions): void {
        const amountOfItems = 10;
        for (let i = 0; i < amountOfItems; i++) {
            this._items.push({
                title: `Заголовок шага ${i}`,
                contentTemplate,
                stepStyle: 'demo',
            });
        }
    }
}
