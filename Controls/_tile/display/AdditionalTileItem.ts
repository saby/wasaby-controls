/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import TileCollectionItem, { ITileCollectionItemOptions } from './TileCollectionItem';
import { ITileItemProps, TTileItem } from 'Controls/_tile/display/mixins/TileItem';

export interface IAdditionalTileItemOptions extends ITileCollectionItemOptions {
    additionalItemTemplate: TemplateFunction;
    position: 'before' | 'after';
}

/**
 * Размер дополниткельных элементов.
 * @typedef {String} Controls/_tile/display/AdditionalTileItem/TAdditionalContentSize
 * @variant auto Автоматически подстраивать под параметры, указанные в itemTemplate
 * @variant custom Игноировать параметры, указанные в itemTemplate
 */
export type TAdditionalContentSize = 'custom' | 'auto';

/**
 * Элемент добавления записей в плиточной коллекции
 * @private
 */
export default class AdditionalTileItem extends TileCollectionItem {
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;

    /**
     * Реактивность опции обеспечивается на уровне коллекции. При установке через setter, сбрасывается стратегия
     * и пересоздаётся элемент дополнительного элемента. Так же работает, например, nodeFooter.
     */
    protected _$additionalItemTemplate: TemplateFunction;
    protected _$position: 'before' | 'after';
    protected _$usingCustomItemTemplates: boolean;

    get key(): string {
        return this._instancePrefix + this._$position;
    }

    protected constructor(options: IAdditionalTileItemOptions) {
        super(options);
        this._$additionalItemTemplate = options.additionalItemTemplate;
        this._$position = options.position;
    }

    getItemStyles(): React.CSSProperties {
        return null;
    }

    /**
     * Стили дополнительного элемента.
     * Необходимо для управления шириной плитки.
     * @param itemType
     * @param width
     * @param staticHeight
     * @param size
     */
    getAdditionalItemStyles(
        itemType: TTileItem = 'default',
        width?: number | string,
        staticHeight?: boolean,
        size: TAdditionalContentSize = 'auto'
    ): React.CSSProperties {
        return size === 'auto' ? super.getItemStyles({ itemType, width, staticHeight }) : null;
    }

    getItemClasses(): string {
        return '';
    }

    /**
     * Задаёт на элемент обязательные классы элемента
     * @param itemType
     * @param templateClickable
     * @param hasTitle
     * @param cursor
     * @param shadowVisibility
     * @param highlightOnHover
     * @param border
     * @param borderStyle
     * @param size
     */
    getAdditionalItemClasses({
        itemType = 'default',
        templateClickable,
        hasTitle,
        cursor = 'pointer',
        shadowVisibility = 'visible',
        highlightOnHover = false,
        border = false,
        borderStyle,
        size,
    }: ITileItemProps & {
        size?: TAdditionalContentSize;
    }): string {
        let classes = super.getItemClasses({
            itemType,
            clickable: cursor === 'pointer',
            hasTitle,
            cursor,
            shadowVisibility,
            highlightOnHover,
            border,
            borderStyle,
        });

        if (itemType === 'preview' || itemType === 'medium' || itemType === 'default') {
            classes += ` controls-TileView__item_shadow_${this.getShadowVisibility(
                shadowVisibility
            )}`;
            classes += this.getBorderClasses(border, borderStyle);
        }

        classes += ' controls-TileView__additionalTile';

        if (size === 'custom' || itemType === 'rich') {
            classes += ' ws-flexbox ws-justify-content-center ws-align-items-center';
        }
        if (size !== 'custom') {
            classes += ' controls-TileView__additionalTile_size_auto';
        }
        return classes;
    }

    /**
     * Стили, которые вешаются на внутренний скрываемый контент плитки,
     * Чтобы обеспечить корректное растягивание по высоте шаблона дополнительного элемента.
     * Сделано для того, чтобы кнопка "+" при переходе на другую строку могла брать вертикальные
     * размеры от соседних плиток.
     */
    getVerticalResizerStyles(): React.CSSProperties {
        return {
            visibility: 'hidden',
            width: 0,
            margin: 0,
            padding: 0,
        };
    }

    /**
     * Возвращает переданный в опцию beforeItemsTemplate / afterItemsTemplate шаблон дополнительного элемента.
     */
    getAdditionalItemTemplate(): TemplateFunction {
        return this._$additionalItemTemplate;
    }

    getTemplate(): TemplateFunction {
        if (this._$usingCustomItemTemplates) {
            return this._$additionalItemTemplate;
        } else {
            return super.getTemplate.apply(this, arguments);
        }
    }
}

Object.assign(AdditionalTileItem.prototype, {
    '[Controls/_tile/AdditionalTileItem]': true,
    _moduleName: 'Controls/tile:AdditionalTileItem',
    _instancePrefix: 'additional-tile-item-',
    _$usingCustomItemTemplates: false,
});
