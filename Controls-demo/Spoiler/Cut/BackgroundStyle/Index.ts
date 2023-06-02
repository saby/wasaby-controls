import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/BackgroundStyle/BackgroundStyle');

class BackgroundStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = [
        'Controls-demo/Spoiler/Cut/BackgroundStyle/BackgroundStyle',
    ];
}

export default BackgroundStyle;
