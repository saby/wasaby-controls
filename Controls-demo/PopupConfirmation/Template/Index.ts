import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupConfirmation/Template/Template');

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _buttons: [] = [
        {
            caption: 'Да',
            backgroundStyle: 'primary',
        },
        {
            caption: 'Отмена',
            viewMode: 'link',
            fontColorStyle: 'unaccented',
        },
    ];
}
export default Demo;
