import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Container/InitialScrollPosition/VerticalEnd/Template');

export default class ContainerDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };
}
