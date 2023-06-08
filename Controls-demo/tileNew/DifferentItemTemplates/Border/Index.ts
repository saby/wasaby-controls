import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TileCollectionItem } from 'Controls/tile';
import { IRoundBorder } from 'Controls/interface';
import { TBorderStyle } from 'Controls/display';

import 'css!Controls-demo/tileNew/DifferentItemTemplates/Border/Template';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/Border/Template';

import { DATA } from 'Controls-demo/tileNew/DataHelpers/HorizontalImageSize';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _clickedItemButton: string;
    // Скругление углов
    protected _roundBorder: IRoundBorder = {
        bl: 'm',
        br: 'm',
        tl: 'm',
        tr: 'm',
    };
    // Текущий цвет рамки
    protected _borderStyle: TBorderStyle;
    // Варианты цвета рамки
    protected _borderStyleVariants: TBorderStyle[] = ['default', 'danger'];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: DATA,
        });
    }

    protected _setBorderStyle(e: SyntheticEvent, value: TBorderStyle): void {
        this._borderStyle = value;
    }

    protected _clickHandler(e: SyntheticEvent, item: TileCollectionItem): void {
        this._clickedItemButton = item.key;
    }
}
