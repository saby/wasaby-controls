import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Decorator/Money/Hovered/Template');
import 'css!Controls/CommonClasses';

class Hovered extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _hoveredStateForDoubleColor: boolean = false;
    protected _hoveredStateForTreeColor: boolean = false;

    protected _mouseEventHandlerForDoubleColor(): void {
        this._hoveredStateForDoubleColor = !this._hoveredStateForDoubleColor;
    }

    protected _mouseEventHandlerForTreeColor(): void {
        this._hoveredStateForTreeColor = !this._hoveredStateForTreeColor;
    }
}

export default Hovered;
