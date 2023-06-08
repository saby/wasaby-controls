import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TBorderStyle, TBorderVisibility, TShadowVisibility } from 'Controls/display';
import { IRoundBorder, TOffsetSize, TRoundBorderSize } from 'Controls/interface';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/BorderVisibility/BorderVisibility';

export default class extends Control {
    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/list_new/ItemTemplate/hoverBackgroundStyle/hoverBackgroundStyle',
    ];
    protected _template: TemplateFunction = Template;
    // Скругление углов
    protected _roundBorder: IRoundBorder;
    // Видимость тени
    protected _shadowVisibility: TShadowVisibility = 'hidden';
    // Видимость рамки
    protected _borderVisibility: TBorderVisibility = 'hidden';
    // Текущий цвет рамки
    protected _borderStyle: TBorderStyle;
    // Варианты скругления углов
    protected _roundBorderVariants: string[] = [
        'null',
        '3xs',
        '2xs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        '2xl',
        '3xl',
    ];
    // Варианты цвета рамки
    protected _borderStyleVariants: TBorderStyle[] = ['default', 'danger'];
    // Расстояние между записями
    protected _itemsSpacing: TOffsetSize = null;
    // Варианты расстояния между записями
    protected _itemsSpacingVariants: string[] = [
        'null',
        '3xs',
        '2xs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        '2xl',
        '3xl',
    ];
    // Операциин над записью
    protected _itemActions: IItemAction[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._itemActions = getItemActions();
    }

    protected _setShadowVisibility(e: SyntheticEvent, value: string): void {
        this._shadowVisibility = value;
    }

    protected _setBorderVisibility(e: SyntheticEvent, value: string): void {
        this._borderVisibility = value;
    }

    protected _setRoundBorder(e: SyntheticEvent, value: TRoundBorderSize): void {
        this._roundBorder = {
            bl: value,
            br: value,
            tl: value,
            tr: value,
        };
    }

    protected _setBorderStyle(e: SyntheticEvent, value: TBorderStyle): void {
        this._borderStyle = value;
    }

    protected _setItemsSpacing(e: SyntheticEvent, value: TOffsetSize): void {
        this._itemsSpacing = value;
    }
}
