/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { mixin } from 'Types/util';

import {
    Collection as BaseCollection,
    GridLadderUtil,
    IEditingConfig,
    IHasMoreData,
    IItemActionsTemplateConfig,
    ISessionItems,
    ItemsFactory,
} from 'Controls/display';

import GroupRow from './GroupRow';
import GridMixin, { IOptions as IGridMixinOptions } from './mixins/Grid';
import Row, { IOptions as IRowOptions } from './Row';
import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel, Model } from 'Types/entity';
import { IObservable } from 'Types/collection';
import { IDirection } from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import Indicator from './Indicator';
import AnimatedRow from './AnimatedRow';

export type IOptions<S extends Model = Model, T extends Row<S> = Row<S>> = IGridMixinOptions;

const LADDER_IGNORE_PROPERTIES = [
    'selected',
    'marked',
    'swiped',
    'hovered',
    'active',
    'dragged',
    'editingContents',
    'hideIndicator',
    'displayIndicator',
];

/**
 * @public
 * @implements Controls/grid:GridMixin
 */
export default class Collection<S extends Model = Model, T extends Row<S> = Row<S>> extends mixin<
    BaseCollection<S, T>,
    GridMixin<S, T>
>(BaseCollection, GridMixin) {
    protected _$hasStickyGroup: boolean = false;
    protected _animationItemModule: typeof Row = AnimatedRow;

    constructor(options: IOptions<S, T>) {
        super(options);
        GridMixin.initMixin(this, options);
        this._publish('onColumnsConfigChanged');
    }

    // region override

    setEmptyTemplate(emptyTemplate: TemplateFunction): boolean {
        const superResult = super.setEmptyTemplate(emptyTemplate);
        if (superResult) {
            if (this._$emptyTemplate) {
                if (this._$emptyGridRow) {
                    this._$emptyGridRow.setRowTemplate(this._$emptyTemplate);
                } else {
                    this._initializeEmptyRow();
                }
            } else {
                this._$emptyGridRow = undefined;
            }
        }
        return superResult;
    }

    setEmptyTemplateOptions(options: object): boolean {
        if (super.setEmptyTemplateOptions(options)) {
            if (this.getEmptyGridRow()) {
                this.getEmptyGridRow().setRowTemplateOptions(options);
            }
            return true;
        }
        return false;
    }

    setMultiSelectVisibility(visibility: string): void {
        const oldVisibility = this._$multiSelectVisibility;
        super.setMultiSelectVisibility(visibility);

        // Обновляем заголовки, итоги и тд только если мы показали или скрыли чекбокс.
        // Если поменяли вдимость с onhover на visible или обратно, то не надо ничего трогать,
        // потому что ячейка для столбца с multiSelect уже отрисована.
        if (
            oldVisibility !== visibility &&
            (oldVisibility === 'hidden' || visibility === 'hidden')
        ) {
            [
                this.getColgroup(),
                this.getHeader(),
                this.getResults(),
                this.getFooter(),
                this.getEmptyGridRow(),
            ].forEach((gridUnit) => {
                gridUnit?.setMultiSelectVisibility(visibility);
            });

            [
                this.getTopIndicator(),
                this.getBottomIndicator(),
                this.getGlobalIndicator(),
                this.getTopTrigger(),
                this.getBottomTrigger(),
            ].forEach((gridUnit: Indicator) => {
                gridUnit?.setHasMultiSelectColumn(this.hasMultiSelectColumn());
            });
        }
    }

    setMultiSelectPosition(position: 'default' | 'custom'): boolean {
        const changed = super.setMultiSelectPosition(position);

        if (changed) {
            [
                this.getTopIndicator(),
                this.getBottomIndicator(),
                this.getGlobalIndicator(),
                this.getTopTrigger(),
                this.getBottomTrigger(),
            ].forEach((gridUnit: Indicator) => {
                gridUnit?.setHasMultiSelectColumn(this.hasMultiSelectColumn());
            });
        }

        return changed;
    }

    setActionsTemplateConfig(config: IItemActionsTemplateConfig, silent?: boolean): void {
        super.setActionsTemplateConfig(config, silent);
        if (this.getFooter()) {
            this.getFooter().setActionsTemplateConfig(config);
        }
    }

    setHasMoreData(hasMoreData: IHasMoreData): void {
        super.setHasMoreData(hasMoreData);
        if (this.getFooter()) {
            this.getFooter().setHasMoreData(hasMoreData);
        }
    }

    protected _reBuild(reset?: boolean): void {
        super._reBuild(reset);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties) && !!this._$ladder) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }
        this.getColgroup()?.reBuild();
    }

    setIndexes(start: number, stop: number, shiftDirection: IDirection): void {
        super.setIndexes(start, stop, shiftDirection);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
        if (this.getHeader() && this.hasResizer()) {
            this.getHeader().setRowsCount(start, stop);
        }
        this._updateItemsProperty('setColumnsConfig', this._$columns);
    }

    disableAnimation(): void {
        super.disableAnimation();
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
    }

    protected _shouldUpdateLadder(
        changedItems: ISessionItems<T> = [],
        changeAction?: string
    ): boolean {
        return LADDER_IGNORE_PROPERTIES.indexOf(changedItems.properties) === -1;
    }

    protected _handleAfterCollectionChange(
        changedItems: ISessionItems<T> = [],
        changeAction?: string
    ): void {
        super._handleAfterCollectionChange(changedItems, changeAction);
        if (
            GridLadderUtil.isSupportLadder(this._$ladderProperties) &&
            this._shouldUpdateLadder(changedItems, changeAction)
        ) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }

        // Сбрасываем модель заголовка если его видимость зависит от наличия данных и текущее действие
        // это смена записей.
        const headerIsVisible = this._headerIsVisible(this._$header, this._$headerVisibility);
        if (changeAction === IObservable.ACTION_RESET && !headerIsVisible) {
            this._$headerModel = null;
        }

        this._updateHasStickyGroup();

        if (!this._resultsIsVisible()) {
            this._$results = null;
        }
    }

    protected _removeItems(start: number, count?: number): T[] {
        const result = super._removeItems(start, count);

        if (this._$headerModel && !this._headerIsVisible(this._$header, this._$headerVisibility)) {
            this._$headerModel = null;
        }

        return result;
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: IRowOptions<S>): T {
            options.columnsConfig = this._$columns;
            options.gridColumnsConfig = this._$columns;
            options.colspanCallback = this._$colspanCallback;
            options.columnSeparatorSize = this._$columnSeparatorSize;
            options.rowSeparatorSize = this._$rowSeparatorSize;
            options.colspanGroup = this._$colspanGroup;
            options.hasStickyGroup = this._$hasStickyGroup;
            options.itemActionsPosition = this._$itemActionsPosition;
            options.useSpacingColumn = this._$useSpacingColumn;
            options.ladderMode = this._$ladderMode;
            options.hasMultiSelectColumn = this.hasMultiSelectColumn();
            options.getRowProps = this._$getRowProps;
            return superFactory.call(this, options);
        };
    }

    protected _getGroupItemConstructor(): new () => GroupRow<T> {
        return GroupRow;
    }

    getAdditionalGroupConstructorParams() {
        return {
            ...super.getAdditionalGroupConstructorParams(),
            colspanGroup: this._$colspanGroup,
            gridColumnsConfig: this._$columns,
            columnsConfig: this._$columns,
            getRowProps: null,
            getGroupProps: this._$getGroupProps,
            groupRender: this._$groupRender,
        };
    }

    setGroupProperty(groupProperty: string): boolean {
        const groupPropertyChanged = super.setGroupProperty(groupProperty);
        if (groupPropertyChanged) {
            this._updateHasStickyGroup();
        }
        return groupPropertyChanged;
    }

    protected _setMetaResults(metaResults: EntityModel): void {
        super._setMetaResults(metaResults);
        this._$results?.setMetaResults(metaResults);
    }

    setEditing(editing: boolean): void {
        super.setEditing(editing);

        if (this._$headerModel && !this._headerIsVisible(this._$header, this._$headerVisibility)) {
            this._$headerModel = null;
        }
        this._nextVersion();
    }

    setEditingConfig(config: IEditingConfig): boolean {
        const changed = super.setEditingConfig(config);
        if (changed) {
            this._updateItemsProperty('setEditingConfig', config, 'setEditingConfig');
        }
        return changed;
    }

    // endregion

    protected _updateHasStickyGroup(): void {
        const hasStickyGroup = this._hasStickyGroup();
        if (this._$hasStickyGroup !== hasStickyGroup) {
            this._$hasStickyGroup = hasStickyGroup;
            this._updateItemsProperty('setHasStickyGroup', this._$hasStickyGroup, 'LadderSupport');
        }
    }
}

Object.assign(Collection.prototype, {
    '[Controls/_display/grid/Collection]': true,
    _moduleName: 'Controls/grid:GridCollection',
    _itemModule: 'Controls/grid:GridDataRow',
    _spaceItemModule: 'Controls/grid:SpaceRow',
});

/**
 * @typedef {Function} TResultsColspanCallback
 * @description
 * Функция обратного вызова для расчёта объединения колонок строки (колспана).
 * @param {Controls/grid:IColumn} column Колонка грида
 * @param {Number} columnIndex Индекс колонки грида
 * @remark Возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение 'end'.
 */

/**
 * @typedef {Function} TColspanCallback
 * @description
 * Функция обратного вызова для расчёта объединения колонок строки (колспана).
 * @param {Types/entity:Model} item Элемент, для которого рассчитывается объединение
 * @param {Controls/grid:IColumn} column Колонка грида
 * @param {Number} columnIndex Индекс колонки грида
 * @param {Boolean} isEditing Актуальное состояние редактирования элемента
 * @remark Возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение 'end'.
 */

/**
 * @typedef {Function} TEditArrowVisibilityCallback
 * @description
 * Функция обратного вызова для определения видимости кнопки редактирования
 * @param {Types/entity:Record} item Model
 */
