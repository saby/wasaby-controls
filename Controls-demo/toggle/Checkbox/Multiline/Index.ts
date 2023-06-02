import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/Checkbox/Multiline/Template');

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value1: boolean = false;
    protected _value2: boolean = false;
    protected _caption: string =
        'Подтверждаю правильность моих данных и соглашаюсь на обработку';
}
export default ViewModes;
