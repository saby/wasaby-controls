/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import template = require('wml!Controls/_columns/render/Columns');

import defaultItemTemplate from 'Controls/_columns/render/resources/Item';

import { ListView, IList } from 'Controls/baseList';
import ColumnsCollection from 'Controls/_columns/display/Collection';
import ColumnsCollectionItem from 'Controls/_columns/display/CollectionItem';
import { DEFAULT_COLUMNS_COUNT } from '../Constants';
import { IItemPadding } from 'Controls/display';
import { ColumnsMode } from '../interface/IColumnsView';

export interface IColumnsRenderOptions extends IList {
    columnMinWidth: number;
    columnMaxWidth: number;
    columnsMode: ColumnsMode;
    columnsCount: number;
    maxColumnsCount: number;
    spacing: number;
    listModel: ColumnsCollection;
    availableWidth?: number;
    initialWidth?: number;
    itemsContainerPadding?: IItemPadding;
    itemPadding?: IItemPadding;
    tagStyleProperty?: string;
    isAdaptive?: boolean;
}

export default class Columns extends ListView {
    protected _options: IColumnsRenderOptions;
    protected _template: TemplateFunction = template;
    protected _templateKeyPrefix: string;

    protected _beforeMount(options: IColumnsRenderOptions): void {
        super._beforeMount(options);
        this._templateKeyPrefix = 'columns-render';
        this._onTagClick = this._onTagClick.bind(this);
        this._onTagHover = this._onTagHover.bind(this);
        this._commitEditActionHandler = options._commitEditActionHandler;
        this._cancelEditActionHandler = options._cancelEditActionHandler;
    }

    protected _componentDidMount(options: IColumnsRenderOptions): void {
        super._componentDidMount(options);
        this._resizeHandler();
    }

    protected _beforeUpdate(options: IColumnsRenderOptions): void {
        super._beforeUpdate(options);
        if (options.availableWidth && options.availableWidth !== this._options.availableWidth) {
            options.listModel.setCurrentWidth(options.availableWidth, this._options.columnMinWidth);
        }
        if (options.initialWidth && options.initialWidth !== this._options.initialWidth) {
            options.listModel.setCurrentWidth(options.initialWidth, this._options.columnMinWidth);
        }
        if (options.columnsCount !== this._options.columnsCount) {
            options.listModel.setColumnsCount(options.columnsCount);
        }
        if (options.maxColumnsCount !== this._options.maxColumnsCount) {
            options.listModel.setMaxColumnsCount(options.maxColumnsCount);
        }
        if (options.columnMinWidth !== this._options.columnMinWidth) {
            options.listModel.setColumnMinWidth(options.columnMinWidth);
        }
        if (options.tagStyleProperty !== this._options.tagStyleProperty) {
            options.listModel.setTagStyleProperty(options.tagStyleProperty);
        }
    }

    protected _componentDidUpdate(): void {
        this._updateColumnsHeight();
    }

    protected _resizeHandler(): void {
        // Список, скрыт на другой вкладке/панели. Не нужно обрабатывать такой ресайз (сейчас ширина 0)
        // А также, при построении на скрытой вкладке, ширина может быть неактуальна.
        if (
            this._container &&
            this._container.closest &&
            (this._container.closest('.ws-hidden') ||
                this._container.closest('.ws-outside-hidden') ||
                this._container.closest('.controls-Popup__hidden') ||
                this._container.closest('.page-ReactTemplateSwitch__hidden'))
        ) {
            return;
        }
        const listContainer = this._container.parentElement;
        const currentWidth = listContainer.getBoundingClientRect().width;
        this._updateColumnsHeight();
        this._options.listModel.setCurrentWidth(currentWidth, this._options.columnMinWidth);
    }

    protected _updateColumnsHeight() {
        if (this._options.columnsMode === 'adaptive') {
            const columnsHeights = [];
            const itemsHeights = {};
            for (let col = 0; col < this._options.listModel.getColumnsCount(); col++) {
                const items = this._container.querySelectorAll(
                    `.controls-ColumnsView_column_${col}>.controls-ColumnsView__itemV`
                );
                columnsHeights[col] =
                    items[items.length - 1]?.offsetTop + items[items.length - 1]?.offsetHeight || 0;
                for (let i = 0; i < items.length; i++) {
                    itemsHeights[items[i].getAttribute('item-key')] = items[i]?.offsetHeight || 0;
                }
            }
            this._options.listModel.setColumnsHeight(columnsHeights);
            this._options.listModel.setItemsHeightsCache(itemsHeights);
        }
    }

    protected _getColumnMinWidth(
        columnMinWidth: number | void,
        spacing: number = 0,
        columnsCount: number
    ): string {
        if (columnMinWidth) {
            return `${columnMinWidth + spacing}px`;
        } else {
            return `calc(${Math.round(100 / columnsCount)}%)`;
        }
    }

    protected _getColumnMaxWidth(columnMaxWidth: number | void, spacing: number): string {
        if (columnMaxWidth) {
            return `${columnMaxWidth + spacing}px`;
        } else {
            return '100%';
        }
    }

    private _getPadding(paddingOption: string): IItemPadding {
        return {
            left: this._options[paddingOption]?.left || 'default',
            right: this._options[paddingOption]?.right || 'default',
            top: this._options[paddingOption]?.top || 'default',
            bottom: this._options[paddingOption]?.bottom || 'default',
        };
    }

    protected _getItemsPaddingContainerClasses(): string {
        let classes = ' controls-ColumnsView__itemPaddingContainer';

        const prefix = ' controls-ColumnsView__itemsPaddingContainer_spacing';
        const itemPadding = this._getPadding('itemPadding');
        if (this._options.itemsContainerPadding) {
            const itemsContainerPadding = this._getPadding('itemsContainerPadding');
            classes += `${prefix}Left_${itemsContainerPadding.left}_itemPadding_${itemPadding.left}`;
            classes += `${prefix}Right_${itemsContainerPadding.right}_itemPadding_${itemPadding.right}`;
            classes += `${prefix}Top_${itemsContainerPadding.top}_itemPadding_${itemPadding.top}`;
            classes += `${prefix}Bottom_${itemsContainerPadding.bottom}_itemPadding_${itemPadding.bottom}`;
        } else {
            if (!this._options.isAdaptive) {
                classes += `${prefix}Left_${itemPadding.left}`;
                classes += `${prefix}Right_${itemPadding.right}`;
            } else {
                classes += ' controls-ColumnsView__itemsPaddingContainer_spacingLeft_is-adaptive';
                classes += ' controls-ColumnsView__itemsPaddingContainer_spacingRight_is-adaptive';
            }
            classes += `${prefix}Top_${itemPadding.top}`;
            classes += `${prefix}Bottom_${itemPadding.bottom}`;
        }
        return classes;
    }

    protected _getColumnPaddingClasses(): string {
        let classes = '';
        if (!this._options.isAdaptive) {
            const itemPadding = this._getPadding('itemPadding');
            classes += ` controls-ColumnsView__item_spacingLeft_${itemPadding.left}`;
            classes += ` controls-ColumnsView__item_spacingRight_${itemPadding.right}`;
        } else {
            classes += 'controls-ColumnsView__item_spacingLeft_is-adaptive';
            classes += ' controls-ColumnsView__item_spacingRight_is-adaptive';
        }
        return classes;
    }

    protected _getItemsContainerStyle(): string {
        const spacing = this._options.listModel.getSpacing();
        const columnsCount = this._options.listModel.getColumnsCount();
        const columnMinWidth = this._getColumnMinWidth(
            this._options.columnMinWidth,
            spacing,
            columnsCount
        );
        const columnMaxWidth = this._getColumnMaxWidth(this._options.columnMaxWidth, spacing);
        const minmax = `minmax(${columnMinWidth}, ${columnMaxWidth}) `;
        const gridTemplate = minmax.repeat(columnsCount);
        return `grid-template-columns: ${gridTemplate};
                -ms-grid-columns: ${gridTemplate};`;
    }

    protected _getItemsContainerClasses(): string {
        let classes = 'controls-ColumnsView__itemsContainer ';
        classes += !!this._options.maxColumnsCount ? 'tw-justify-center' : 'tw-justify-flex-start';
        return classes;
    }

    protected _getMinMaxWidthStyle(min: number, max: number): string {
        const spacing = this._options.listModel.getSpacing();
        const columnsCount = this._options.listModel.getColumnsCount();
        const columnMinWidth = this._getColumnMinWidth(min, spacing, columnsCount);
        const columnMaxWidth = this._getColumnMaxWidth(max, spacing);
        return `min-width:${columnMinWidth}; max-width:${columnMaxWidth}px; `;
    }
    protected _getPlaceholderStyle(column: number): string {
        let style = this._getMinMaxWidthStyle(
            this._options.columnMinWidth,
            this._options.columnMaxWidth
        );
        const placeholder = this._options.listModel.getColumnPlaceholder(column);
        style += ` height: ${placeholder}px;`;
        return style;
    }

    protected _getColumnStyle(index: number, groupIndex: number = 0): string {
        return (
            this._getMinMaxWidthStyle(this._options.columnMinWidth, this._options.columnMaxWidth) +
            `-ms-grid-column: ${index + 1};` +
            `-ms-grid-row: ${2 * (groupIndex + 1)};`
        );
    }

    // @TODO Эти пробросы можно будет убрать когда перепишем columns на React
    protected _onTagClick(
        event: Event,
        item: ColumnsCollectionItem<Model>,
        columnIndex: number
    ): void {
        this._options.onTagClick(event, item, columnIndex);
    }
    protected _onTagHover(
        event: Event,
        item: ColumnsCollectionItem<Model>,
        columnIndex: number
    ): void {
        this._options.onTagHover(event, item, columnIndex);
    }

    static readonly itemsSelector: string =
        '.controls-ColumnsView_column > .controls-ListView__itemV';

    static getDefaultOptions(): Partial<IColumnsRenderOptions> {
        return {
            itemTemplate: defaultItemTemplate,
            columnsMode: 'auto',
            columnsCount: DEFAULT_COLUMNS_COUNT,
        };
    }
}

/*
 * Имя сущности для идентификации списка.
 */
Object.defineProperty(Columns.prototype, 'listInstanceName', {
    value: 'controls-Columns',
    writable: false,
});
