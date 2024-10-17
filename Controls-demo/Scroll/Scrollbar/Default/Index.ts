import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Scrollbar/Default/Index');
import 'css!Controls-demo/Scroll/Scrollbar/Default/Style';

export default class DefaultScrollbarDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _position: number = 0;
    protected _positionHorizontal: number = 0;
    protected _verticalPadding: object = { start: false, end: true };
    protected _horizontalPadding: object = { start: false, end: true };
}
