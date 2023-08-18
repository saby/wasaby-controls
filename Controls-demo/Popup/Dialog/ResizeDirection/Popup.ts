import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/ResizeDirection/Popup');

class Popup extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _height: number = 200;
    protected _width: number = 300;
    protected _minWidth: number = 300;
    protected _minHeight: number = 200;
    protected _resizeHeight: number = 400;
    protected _resizeWidth: number = 600;
    protected _enlargeButton: string = 'Увеличить';
    protected _reduceButton: string = 'Уменьшить';
    protected _buttonCaption: string = 'Увеличить';

    protected _handleResizeClick(): void {
        if (this._height === 200 && this._width === 300) {
            this._height = this._resizeHeight;
            this._width = this._resizeWidth;
            this._buttonCaption = this._reduceButton;
        } else {
            this._height = this._minHeight;
            this._width = this._minWidth;
            this._buttonCaption = this._enlargeButton;
        }
    }
    static _styles: string[] = ['Controls-demo/Popup/Dialog/ResizeDirection/Popup'];
}
export default Popup;
