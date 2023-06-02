import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Number/FontSize/Template');
import 'css!Controls/CommonClasses';

class Number extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _data: string[] = [
        'xs',
        's',
        'm',
        'l',
        'xl',
        '3xl',
        '6xl',
        '8xl',
    ];
}

export default Number;
