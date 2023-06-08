import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { getColorsData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/FontColorStyle/FontColorStyle';

const FontColorStyles = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'unaccented',
    'link',
    'label',
    'info',
    'default',
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _selectedFontColorStyle: number = 0;
    protected _fontColorStyle: string = FontColorStyles[0];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getColorsData(),
        });
    }

    protected _changeFontColorStyle(): void {
        this._selectedFontColorStyle++;
        if (this._selectedFontColorStyle === FontColorStyles.length) {
            this._selectedFontColorStyle = 0;
        }
        this._fontColorStyle = FontColorStyles[this._selectedFontColorStyle];
    }
}
