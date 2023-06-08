import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/BackgroundHoverStyle/BackgroundHoverStyle';
import { Memory } from 'Types/source';
import { TColumnSeparatorSize, IGridEditingConfig } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IRoundBorder, TRoundBorderSize } from 'Controls/interface';
import {
    TBorderVisibility,
    TShadowVisibility,
    TBorderStyle,
    TRowSeparatorSize,
    TItemActionsPosition,
} from 'Controls/display';
import { IItemAction } from 'Controls/interface';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import * as ItemEditorTemplate from 'wml!Controls-demo/gridNew/BackgroundHoverStyle/itemEditorTemplate';

const MAXINDEX = 5;

type TEditingTemplateType = 'null' | 'RowTemplate';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _hoverBackground: string = 'primary';
    // Скругление углов
    protected _roundBorder: IRoundBorder;
    // Видимость тени
    protected _shadowVisibility: TShadowVisibility = 'hidden';
    // Видимость рамки
    protected _borderVisibility: TBorderVisibility = 'hidden';
    // Текущий цвет рамки
    protected _borderStyle: TBorderStyle;
    // Горизонтальный разделитель
    protected _horizontalSeparator: TRowSeparatorSize;
    // Вертикальный разделитель
    protected _verticalSeparator: TColumnSeparatorSize;
    // Варианты скругления углов
    protected _roundBorderVariants: string[] = [
        'null',
        'xs',
        's',
        'm',
        'l',
        'xl',
        '3xs',
        '2xs',
    ];
    // Варианты цвета рамки
    protected _borderStyleVariants: TBorderStyle[] = ['default', 'danger'];
    // варанты цвета фона
    protected _hoverBackgroundVariants: string[] = [
        'primary',
        'default',
        'transparent',
        'secondary',
        'danger',
        'success',
        'warning',
        'info',
        'unaccented',
    ];
    // Варианты горизонтальных разделителей
    protected _horizontalSeparatorVariants: string[] = ['s', 'l', null];
    // Варианты вертикальных разделителей
    protected _verticalSeparatorVariants: string[] = ['s', null];
    // Варианты видимости чекбоксов для множественного выбора
    protected _multiSelectVisibilityVariants: string[] = [
        'visible',
        'hidden',
        'onhover',
    ];
    protected _itemActions: IItemAction[] = getItemActions();
    // конфиг редактирования
    protected _editingConfig?: IGridEditingConfig;
    // шаблон редактирования всей строки
    protected _itemEditorTemplate?: TemplateFunction;
    protected _itemEditorTemplateType: TEditingTemplateType = 'null';
    protected _editingTemplateTypeVariants: TEditingTemplateType[] = [
        'null',
        'RowTemplate',
    ];
    // Позиция операций над записью
    protected _itemActionsPosition: TItemActionsPosition = 'inside';
    // Видимость чекбоксов для множественного выбора
    protected _multiSelectVisibility: string = 'hidden';

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData().slice(0, MAXINDEX),
        });
    }

    protected _setHoverBackground(e: SyntheticEvent, value: string): void {
        this._hoverBackground = value;
    }

    protected _setShadowVisibility(
        e: SyntheticEvent,
        value: TShadowVisibility
    ): void {
        this._shadowVisibility = value;
    }

    protected _setBorderVisibility(
        e: SyntheticEvent,
        value: TBorderVisibility
    ): void {
        this._borderVisibility = value;
    }

    protected _setRoundBorder(
        e: SyntheticEvent,
        value: TRoundBorderSize
    ): void {
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

    protected _setHorizontalSeparator(
        e: SyntheticEvent,
        value: TRowSeparatorSize
    ): void {
        this._horizontalSeparator = value;
    }

    protected _setVerticalSeparator(
        e: SyntheticEvent,
        value: TColumnSeparatorSize
    ): void {
        this._verticalSeparator = value;
    }

    protected _setEditingTemplateType(
        e: SyntheticEvent,
        value: TEditingTemplateType
    ): void {
        this._itemEditorTemplateType = value;
        if (this._itemEditorTemplateType === 'null') {
            this._editingConfig = undefined;
            this._itemEditorTemplate = undefined;
        } else if (this._itemEditorTemplateType === 'RowTemplate') {
            this._editingConfig = { editOnClick: true };
            this._itemEditorTemplate = ItemEditorTemplate;
        }
    }

    protected _setItemActionsPosition(
        e: SyntheticEvent,
        value: TItemActionsPosition
    ): void {
        this._itemActionsPosition = value;
    }

    protected _setMultiSelectVisibility(
        e: SyntheticEvent,
        value: string
    ): void {
        this._multiSelectVisibility = value;
    }

    static _styles: string[] = [
        'Controls-demo/gridNew/BackgroundHoverStyle/BackgroundHoverStyle',
    ];
}
