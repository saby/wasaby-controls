import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/MoneyNew/Example/Index');

class Index extends Control<IControlOptions> {
    protected _value: string = '3.0';
    protected _precision: number = 2;
    protected _template: TemplateFunction = controlTemplate;

    protected _onValueChanged(e: Event, value: string): void {
        if (value.split('.')[0].length > 12) {
            this._precision = 0;
        } else {
            this._precision = 2;
        }
    }
}

export default Index;
