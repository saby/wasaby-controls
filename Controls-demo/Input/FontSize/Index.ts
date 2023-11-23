import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/FontSize/FontSize');

class SizesAndHeights extends Control<IControlOptions> {
    protected _fontSizeSValue: string = SizesAndHeights._defaultValue;
    protected _fontSizeMValue: string = SizesAndHeights._defaultValue;
    protected _fontSizeLValue: string = SizesAndHeights._defaultValue;
    protected _fontSizeXLValue: string = SizesAndHeights._defaultValue;
    protected _fontSize2XLValue: string = SizesAndHeights._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}

export default SizesAndHeights;
