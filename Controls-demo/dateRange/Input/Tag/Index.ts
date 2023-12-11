import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/dateRange/Input/Tag/Tag');

class Range extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _tagClickHandler(e: Event, fieldName: string, target: HTMLElement): void {
        this._children.infoBox.open({
            target,
            message: `This field ${fieldName} is required`,
        });
    }
}

export default Range;
