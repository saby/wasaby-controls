import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/SizesAndHeights/SizesAndHeights');

class SizesAndHeights extends Control<IControlOptions> {
    protected _sizeAndHeightXSValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeightSValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeightMValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeightLValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeightXLValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeight2XLValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeight3XLValue: string = SizesAndHeights._defaultValue;
    protected _sizeAndHeight4XLValue: string = SizesAndHeights._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}

export default SizesAndHeights;
