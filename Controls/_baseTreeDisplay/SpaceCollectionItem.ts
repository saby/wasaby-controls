/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import { TOffsetSize } from 'Controls/_interface/IOffset';
import TreeItem, { IOptions } from './TreeItem';
import Tree from './Tree';
import { TBackgroundStyle } from 'Controls/interface';

export interface ISpaceCollectionItemOptions extends IOptions<Model> {
    owner: Tree;
    itemsSpacing?: TOffsetSize;
}

/**
 * Класс реализующий строку-отступ в обычных списках.
 * Основная задача данного класса - реализовать отступ требуемого размера между записями с данными.
 * Инстансы данного класса встраиваются в коллекцию при помощи стратегии ItemsSpacingStrategy.
 * @private
 */
export class SpaceCollectionItem extends TreeItem {
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

    readonly listElementName: string = 'space-item';

    protected _$itemsSpacing: TOffsetSize;

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

        result += ' controls-List__SpaceItem';

        if (this._$itemsSpacing) {
            result += ` ${SpaceCollectionItem.buildVerticalSpacingClass(this._$itemsSpacing)}`;
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
    _moduleName: 'Controls/baseTree:SpaceCollectionItem',
    _$itemsSpacing: null,
});