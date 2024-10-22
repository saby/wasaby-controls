/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel } from 'Types/entity';
import { mixin } from 'Types/util';

import { IColumn } from './interface/IColumn';
import { GroupMixin } from 'Controls/display';

import DataCell from './DataCell';
import GroupRow from './GroupRow';
import type { TGetGroupPropsCallback, IGroupComponentProps } from 'Controls/gridReact';
import { IGroupRowComponentProps } from 'Controls/gridReact';

export interface IOptions<T> {
    owner: GroupRow<T>;
    column: IColumn;
    columnsLength: number;
    contents: string;
    groupTemplate: TemplateFunction | string;
    zIndex?: number;
    metaResults: EntityModel;
    colspanGroup?: boolean;
    task1184913014?: boolean;
    getGroupProps?: TGetGroupPropsCallback;
}

export const DEFAULT_GROUP_CELL_Z_INDEX = 3;
export const FIXED_GROUP_CELL_Z_INDEX = 4;

const DEFAULT_GROUP_RENDER = 'Controls/grid:GroupTemplate';

/**
 * Ячейка строки, отображающей название группы
 * @private
 */
export default class GroupCell<TContents extends EntityModel = EntityModel> extends mixin<
    DataCell<TContents, GroupRow<TContents>>,
    GroupMixin
>(DataCell, GroupMixin) {
    protected _$columnsLength: number;
    protected _$contents: string;
    protected _$zIndex: number;
    protected _$groupTemplate: TemplateFunction | string;
    protected _$metaResults: EntityModel;
    protected _$colspanGroup: EntityModel;
    readonly '[Controls/_display/grid/GroupCell]': boolean;

    // До https://online.sbis.ru/opendoc.html?guid=75486181-2f75-4fa6-bd74-79e475f618b9
    protected _$task1184913014: boolean;

    readonly listInstanceName: string = 'controls-Grid__group';

    // TODO Перетащить в Controls/_grid/dirtyRender/group/utils/Group.ts
    getCellComponentProps(rowProps: IGroupRowComponentProps): IGroupComponentProps {
        const cellProps = super.getCellComponentProps(rowProps);

        // Установленный в itemTemplateOptions.backgroundColorStyle
        // имеет наивысший приоритет после isEditing.
        // В новом гриде нужно убирать backgroundStyle и оставлять только backgroundColorStyle
        if (rowProps.backgroundColorStyle && rowProps.groupViewMode === 'titledBlocks') {
            cellProps.stickiedBackgroundStyle = rowProps.backgroundColorStyle;
        }

        delete cellProps.fontSize;
        delete cellProps.fontWeight;
        delete cellProps.fontColorStyle;

        cellProps.valign = 'center';
        cellProps.minHeightClassName = '';
        cellProps.hoverBackgroundStyle = 'none';

        // Не конкатенируем с superProps.className, т.к. там классы для columnScroll, которые мы и так вешаем ниже.
        // А тут они будут ломать columnScroll.
        cellProps.className = this._getHideSeparatorClass(cellProps.backgroundStyle);
        return cellProps;
    }

    // region overrides

    getWrapperStyles(): string {
        let style = this.getColspanStyles();
        if (this._$task1184913014) {
            style += ` z-index: ${this.getZIndex()};`;
        }
        return style.trim();
    }

    getZIndex(): number {
        const defaultZIndex =
            this._$zIndex || (this._$task1184913014 ? DEFAULT_GROUP_CELL_Z_INDEX : 2);
        return this._$isFixed ? Math.max(FIXED_GROUP_CELL_Z_INDEX, defaultZIndex) : defaultZIndex;
    }

    getContentStyles(): string {
        return 'display: contents;';
    }

    getTemplate(): TemplateFunction | string {
        return this._$groupTemplate || DEFAULT_GROUP_RENDER;
    }

    // endregion overrides

    // region Аспект "Рендер"

    getDefaultDisplayValue(): string {
        return this._$contents;
    }

    // endregion Аспект "Рендер"

    // region Аспект "Ячейка группы"

    getMetaResults(): EntityModel {
        return this._$metaResults;
    }

    isExpanded(): boolean {
        return this._$owner.isExpanded();
    }

    private _getGroupContentWrapperClasses(): string {
        let classes = ' controls-ListView__GroupContentWrapper';

        if (this.isFirstColumn()) {
            classes += ' controls-ListView__GroupContentWrapper_first';
        }
        if (this.isLastColumn()) {
            classes += ' controls-ListView__GroupContentWrapper_last';
        }

        return classes;
    }

    // TODO какой-то костыль, стоит переосмыслить.
    private _getHideSeparatorClass(backgroundStyle: string = 'default') {
        /*
            Если у списка задан rowSeparator, то разделитель рисуется у каждого элемента ряда. У ряда перед группировкой
            он не должен отображаться. В rowIterator-е мы никак не можем узнать тип следующего элемента, поэтому приходится
            на уровне группы скрывать разделитель предыдущей записи. Для этого, по аналогии со StickyBlock, навешиваем класс, который добавляет тень
            группе, которая перекроет разделитель.
        */
        const collection = this.getOwner().getOwner();
        if (
            collection.getRowSeparatorVisibility() !== 'edges' &&
            collection.getRowSeparatorSize()
        ) {
            return ` controls-bottom-separator-hide-${backgroundStyle}-${collection.getRowSeparatorSize()}`;
        }
        return '';
    }

    getWrapperClasses(backgroundColorStyle?: string): string {
        let classes = super.getWrapperClasses(backgroundColorStyle, false);
        classes += this._getGroupContentWrapperClasses();

        if (this.isStickied()) {
            classes = classes.replace('controls-background-transparent', '');
        }
        return classes;
    }

    protected _getWrapperSeparatorClasses(): string {
        let classes = ' controls-Grid__no-rowSeparator';
        classes += ' controls-Grid__row-cell_withRowSeparator_size-null';
        return classes;
    }

    protected _getWrapperBaseClasses(templateHighlightOnHover: boolean): string {
        let classes = ` controls-Grid__row-cell controls-Grid__cell_${this.getStyle()}`;
        classes += ` controls-Grid__row-cell_${this.getStyle()}`;
        return classes;
    }

    isContentCell(): boolean {
        const hasColumnScroll =
            this._$owner.hasColumnScroll() || this._$owner.hasColumnScrollReact();
        return !(hasColumnScroll && !this._$isFixed);
    }

    getStickyBackgroundStyle(): string {
        // В случае titledBlocks забираем цвет от items
        if (this._$owner.getGroupViewMode() === 'titledBlocks') {
            const options = this._$owner.getItemTemplateOptions();
            if (options?.backgroundColorStyle) {
                return options.backgroundColorStyle;
            }
        }
        return super.getStickyBackgroundStyle();
    }

    // endregion Аспект "Ячейка группы"

    getVerticalStickyHeaderPosition(): string {
        return 'top';
    }

    getStickyHeaderMode(): string {
        return 'replaceable';
    }
}

Object.assign(GroupCell.prototype, {
    '[Controls/_display/grid/GroupCell]': true,
    _moduleName: 'Controls/grid:GridGroupCell',
    _instancePrefix: 'grid-group-cell-',
    _$owner: null,
    _$columnsLength: null,
    _$task1184913014: false,
    _$zIndex: null,
    _$colspanGroup: true,
    _$contents: null,
    _$groupTemplate: undefined,
    _$metaResults: null,
});
