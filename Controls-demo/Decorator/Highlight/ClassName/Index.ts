import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Highlight/ClassName/ClassName');

class ClassName extends Control<IControlOptions> {
    protected _value: string =
        'Наша мама мыла раму.\n' +
        'Кто бы вымыл нашу маму?\n' +
        'Вся она в песке и пенке,\n' +
        'Поцарапаны коленки.\n' +
        'Если я вдруг магом стану,\n' +
        'Сможет рама вымыть маму.';
    protected _highlightedValue: string = 'мама маму рама';
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/Decorator/Highlight/ClassName/ClassName'];
}

export default ClassName;
