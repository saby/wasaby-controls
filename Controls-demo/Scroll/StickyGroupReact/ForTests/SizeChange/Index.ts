import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyGroupReact/ForTests/SizeChange/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class SizeChange1 extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _height: number = 22;

    protected _changeSize(): void {
        this._height = 24;
    }
}
