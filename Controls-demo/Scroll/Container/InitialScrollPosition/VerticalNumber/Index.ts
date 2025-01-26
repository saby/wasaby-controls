import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Container/InitialScrollPosition/VerticalNumber/Template');

export default class VerticalNumberDemo extends Control<IControlOptions> {
    readonly _template: TemplateFunction = controlTemplate;

    protected _initialScrollPosition: object = {
        vertical: 100,
    };
}
