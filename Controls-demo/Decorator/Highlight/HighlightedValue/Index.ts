import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Highlight/HighlightedValue/HighlightedValue');

class HighlightedValue extends Control<IControlOptions> {
    protected _value: string =
        'Наша мама мыла раму.\n' +
        'Кто бы вымыл нашу маму?\n' +
        'Вся она в песке и пенке,\n' +
        'Поцарапаны коленки.\n' +
        'Если я вдруг магом стану,\n' +
        'Сможет рама вымыть маму.';
    protected _template: TemplateFunction = controlTemplate;
}

export default HighlightedValue;
