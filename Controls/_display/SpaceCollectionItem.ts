/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import { TOffsetSize } from 'Controls/_interface/IOffset';
import type Collection from './Collection';
import { TBackgroundStyle } from 'Controls/interface';
import CollectionItem, { IOptions } from './CollectionItem';

export interface ISpaceCollectionItemOptions extends IOptions<Model> {
    owner: Collection;
    itemsSpacing?: TOffsetSize;
}

/**
 * Класс реализующий строку-отступ в обычных списках.
 * Основная задача данного класса - реализовать отступ требуемого размера между записями с данными.
 * Инстансы данного класса встраиваются в коллекцию при помощи стратегии ItemsSpacingStrategy.
 * @private
 */
export class SpaceCollectionItem extends CollectionItem {
    readonly ActivatableItem: boolean = false;
    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;
    readonly StickableItem: boolean = false;

    protected _$itemsSpacing: TOffsetSize;

    readonly listElementName: string = 'space-item';

    // region methods for template
    /**
     * Возвращает шаблон по которому рендерится строка-отступ
     */
    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return 'Controls/baseList:SpaceItemTemplate';
    }

    /**
     * Возвращает строку с CSS классами для корневого элемента строки
     */
    getWrapperClasses(
        templateHighlightOnHover: boolean = false,
        cursor: string = 'default',
        backgroundColorStyle?: TBackgroundStyle,
        hoverBackgroundColorStyle?: TBackgroundStyle,
        showItemActionsOnHover: boolean = false
    ): string {
        let result = super.getWrapperClasses(
            templateHighlightOnHover,
            cursor,
            backgroundColorStyle,
            hoverBackgroundColorStyle,
            showItemActionsOnHover
        );

        if (this._$itemsSpacing) {
            result += ` ${SpaceCollectionItem.buildVerticalSpacingClass(
                this._$itemsSpacing
            )}`;
        }

        return result;
    }
    // endregion

    /**
     * Задает высоту записи-отступа
     */
    setItemsSpacing(itemsSpacing: TOffsetSize): void {
        this._$itemsSpacing = itemsSpacing;
        this._nextVersion();
    }

    /**
     * На основании размера отступа возвращает CSS класс, который этот отступ реализует
     */
    static buildVerticalSpacingClass(itemsSpacing: TOffsetSize): string {
        if (!itemsSpacing) {
            return '';
        }

        return `controls-list__vertical-spacing_${itemsSpacing.toLowerCase()}`;
    }
}

Object.assign(SpaceCollectionItem.prototype, {
    '[Controls/_display/SpaceCollectionItem]': true,
    _moduleName: 'Controls/display:SpaceCollectionItem',
    _$itemsSpacing: undefined,
});
