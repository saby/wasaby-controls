/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { ListView, IListViewOptions } from 'Controls/baseList';
import { TemplateFunction } from 'UI/Base';
import { GridLadderUtil, GridLayoutUtil } from 'Controls/display';
import * as GridTemplate from 'wml!Controls/_grid/Render/grid/GridView';
import { default as GroupTemplate } from 'Controls/_grid/Render/GroupCellComponent';
import { SyntheticEvent } from 'Vdom/Vdom';
import { validateGridParts } from './utils/ConfigValidation';

import { ColumnScrollViewMixin } from './ViewMixins/ColumnScrollViewMixin';

import { _Options } from 'UI/Vdom';
import { getDimensions } from 'Controls/sizeUtils';
import 'css!Controls/grid';
import 'css!Controls/CommonClasses';
import Collection from './display/Collection';
import Row from './display/Row';
import { IOptions as IGridCollectionOptions } from './display/mixins/Grid';
import { mixin } from 'Types/util';
import { EDIT_ARROW_SELECTOR } from './RenderReact/EditArrowComponent';

interface IGridOptions extends IListViewOptions, IGridCollectionOptions {}

/**
 * Представление таблицы
 * @extends Controls/list:ListView
 * @private
 */
export default class GridView extends mixin<ListView, ColumnScrollViewMixin>(
    ListView,
    ColumnScrollViewMixin
) {
    protected _template: TemplateFunction = GridTemplate;
    protected _groupTemplate: TemplateFunction = GroupTemplate;
    protected _listModel: Collection;
    protected _hoveredCellIndex: number = null;
    protected _hoveredCellItem: number = null;
    protected _ladderTopOffsetStyles: string = '';
    protected _ladderOffsetSelector: string = '';

    constructor(options: IGridOptions) {
        super(options);
        ColumnScrollViewMixin.initMixin(this);
        this.beforeRowActivated = this.beforeRowActivated.bind(this);
        this._onColumnsIndexesChanged = () => {
            this._pendingRedraw = true;
        };
    }

    protected _beforeMount(options: IGridOptions): void {
        super._beforeMount(options);
        this._contentScrollWidth = 0;
        this._columnScrollOnViewBeforeMount(options);
        this._ladderOffsetSelector = `controls-GridView__ladderOffset-${options.uniqueId}`;

        if (options.listModel) {
            this._applyNewOptionsOnComponentMount(options);
        }

        validateGridParts(options);
    }

    _componentDidMount(): void {
        super._componentDidMount.apply(this, arguments);
        this._columnScrollOnViewDidMount();
        this._ladderTopOffsetStyles = this._getLadderTopOffsetStyles();
        this._listModel.setColspanGroup(
            !this._options.columnScroll || !this.isColumnScrollVisible()
        );
        if (this._children && 'scrollObserver' in this._children) {
            this._children.scrollObserver.startRegister([this._children.scrollObserver]);
        }

        if (this._options.task1188023407) {
            this._contentScrollWidth = this._container.scrollWidth;
        }
    }

    _applyChangedOptionsToModel(
        listModel: Collection,
        options: IGridOptions,
        changes: string[]
    ): void {
        let needOptionsValidation = false;

        if (changes.includes('columns')) {
            // Если колонки изменились, например, их кол-во, а данные остались те же, то
            // то без перерисовки мы не можем корректно отобразить данные в новых колонках.
            // правка конфликтует с https://online.sbis.ru/opendoc.html?guid=a8429971-3a3c-44d0-8cca-098887c9c717
            listModel.setColumns(options.columns, false);
            needOptionsValidation = true;
        }

        if (changes.includes('footer')) {
            listModel.setFooter(options);
            needOptionsValidation = true;
        }

        if (changes.includes('header')) {
            listModel.setHeader(options.header);
            needOptionsValidation = true;
        }

        if (changes.includes('headerVisibility')) {
            listModel.setHeaderVisibility(options.headerVisibility);
        }

        if (changes.includes('columnScroll')) {
            listModel.setColumnScroll(options.columnScroll);
        }

        if (changes.includes('columnScrollViewMode')) {
            listModel.setColumnScrollViewMode(options.columnScrollViewMode || 'scrollbar');
        }

        if (changes.includes('resultsPosition')) {
            listModel.setResultsPosition(options.resultsPosition);
        }

        if (changes.includes('resultsVisibility')) {
            listModel.setResultsVisibility(options.resultsVisibility);
        }

        if (changes.includes('ladderProperties')) {
            listModel.setLadderProperties(options.ladderProperties);
        }

        if (changes.includes('emptyTemplateColumns')) {
            listModel.setEmptyTemplateColumns(options.emptyTemplateColumns);
            needOptionsValidation = true;
        }

        if (needOptionsValidation) {
            validateGridParts(options);
        }

        if (changes.includes('itemEditorTemplateOptions')) {
            listModel.setItemEditorTemplateOptions(options.itemEditorTemplateOptions);
        }

        if (changes.includes('resultsTemplateOptions')) {
            listModel.setResultsTemplateOptions(options.resultsTemplateOptions);
        }
    }

    /**
     * Перекрываем метод базового класса, который вызывается из _beforeUpdate.
     * Т.к. у нас своя модель и свои проверки.
     */
    _applyNewOptionsAfterReload(oldOptions: IGridOptions, newOptions: IGridOptions): void {
        const changes = [];

        const changedOptions = _Options.getChangedOptions(newOptions, this._options);

        if (changedOptions) {
            if (
                changedOptions.hasOwnProperty('footer') ||
                changedOptions.hasOwnProperty('footerTemplate')
            ) {
                changes.push('footer');
            }
            if (changedOptions.hasOwnProperty('header')) {
                changes.push('header');
            }
            if (changedOptions.hasOwnProperty('headerVisibility')) {
                changes.push('headerVisibility');
            }
            if (changedOptions.hasOwnProperty('columns')) {
                changes.push('columns');
            }
            if (changedOptions.hasOwnProperty('columnScroll')) {
                changes.push('columnScroll');
            }
            if (changedOptions.hasOwnProperty('dragScrolling')) {
                changes.push('dragScrolling');
            }
            if (changedOptions.hasOwnProperty('resultsPosition')) {
                changes.push('resultsPosition');
            }
            if (changedOptions.hasOwnProperty('resultsVisibility')) {
                changes.push('resultsVisibility');
            }
            if (changedOptions.hasOwnProperty('items')) {
                changes.push('items');
            }
            if (changedOptions.hasOwnProperty('ladderProperties')) {
                changes.push('ladderProperties');
            }
            if (changedOptions.hasOwnProperty('emptyTemplateColumns')) {
                changes.push('emptyTemplateColumns');
            }
            if (changedOptions.hasOwnProperty('itemEditorTemplateOptions')) {
                changes.push('itemEditorTemplateOptions');
            }
            if (changedOptions.hasOwnProperty('resultsTemplateOptions')) {
                changes.push('resultsTemplateOptions');
            }
        }

        if (changes.length) {
            // Набор колонок необходимо менять после перезагрузки. Иначе возникает ошибка, когда список
            // перерисовывается с новым набором колонок, но со старыми данными. Пример ошибки:
            // https://online.sbis.ru/opendoc.html?guid=91de986a-8cb4-4232-b364-5de985a8ed11
            this._freezeColumnScroll();
            this._doAfterReload(() => {
                this._doOnComponentDidUpdate(() => {
                    this._unFreezeColumnScroll();
                });
                this._applyChangedOptionsToModel(this._listModel, newOptions, changes);
            });
        }
    }

    // При переключении с viewMode компонент грида пересоздаётся,
    // при этом в него может передаваться модель, построенная по неактуальным опциям
    _applyNewOptionsOnComponentMount(newOptions: unknown): void {
        if (this._listModel.hasColumnScroll() !== !!newOptions.columnScroll) {
            this._listModel.setColumnScroll(!!newOptions.columnScroll);
        }
    }

    _beforeUpdate(newOptions: IGridOptions): void {
        super._beforeUpdate.apply(this, arguments);
        this._columnScrollOnViewBeforeUpdate(newOptions);

        if (newOptions.sorting !== this._options.sorting) {
            this._listModel.setSorting(newOptions.sorting);
        }

        if (this._options.columnSeparatorSize !== newOptions.columnSeparatorSize) {
            this._listModel.setColumnSeparatorSize(newOptions.columnSeparatorSize);
        }

        if (this._options.emptyTemplateColumns !== newOptions.emptyTemplateColumns) {
            this._pendingRedraw = true;
        }

        if (this._options.rowSeparatorSize !== newOptions.rowSeparatorSize) {
            this._listModel.setRowSeparatorSize(newOptions.rowSeparatorSize);
        }

        if (this._listModel.getEmptyGridRow()) {
            this._listModel
                .getEmptyGridRow()
                .setContainerSize(this._$columnScrollEmptyViewMaxWidth);
        }

        this._ladderTopOffsetStyles = this._getLadderTopOffsetStyles();

        this._listModel.setColspanGroup(!newOptions.columnScroll || !this.isColumnScrollVisible());
    }

    _componentDidUpdate(oldOptions: IGridOptions): void {
        super._componentDidUpdate.apply(this, arguments);
        this._columnScrollOnViewDidUpdate(oldOptions);
    }

    _beforeUnmount(): void {
        super._beforeUnmount.apply(this, arguments);
        this._columnScrollOnViewBeforeUnmount();
    }

    _updateModel(newModel: Collection): void {
        if (this._listModel && !this._listModel.destroyed) {
            this._listModel.unsubscribe('columnsIndexesChanged', this._onColumnsIndexesChanged);
        }
        super._updateModel.apply(this, arguments);
        this._listModel.subscribe('columnsIndexesChanged', this._onColumnsIndexesChanged);
    }

    getListModel(): Collection {
        return this._listModel;
    }

    _resolveItemTemplate(options: IGridOptions): TemplateFunction {
        return options.itemTemplate || this._resolveBaseItemTemplate();
    }

    _resolveBaseItemTemplate(): TemplateFunction | string {
        return 'Controls/grid:ItemTemplate';
    }

    _getGridEmptyTemplateRows(options: IGridOptions): string {
        let styles = 'grid-template-rows:';
        const hasHeader = !!this._listModel.getHeader();
        const hasResults = !!this._listModel.getResults();
        const resultsPosition = this._listModel.getResultsPosition();

        // Пустое представление таблицы растягивается на 100% по высоте
        // В результате, каждая из существующих строк таблицы:
        // (Заголовок, результаты, полоса скролла, строка с ширинами колонок для скролла,
        // сам контент пустого представления и футер) занимают одинаковое место по вертикали.
        // Правки ниже добавляют для пустого представления жёстко заданную сетку строк,
        // определяя, что строки заголовок, результаты, полоса скролла, строка с ширинами колонок для скролла и футер
        // занимают по высоте ровно столько, сколько есть в их контенте,
        // а строка контента пустого представления растягивается максимально,
        // заполняя собой всё пространство между результатами и футером.
        if (hasHeader) {
            styles += ' auto';
        }
        if (hasResults && resultsPosition === 'top') {
            styles += ' auto';
        }

        // Две строки, т.к. ScrollBar + RelativeColumns
        if (options.columnScroll) {
            styles += ' auto auto';
        }

        // Сама строка пустого представления должна максимально растягиваться
        styles += ' 1fr; ';
        return styles;
    }

    _hasItemActionsCell(options: IGridOptions): boolean {
        return Boolean(
            options.isFullGridSupport &&
                (options.stickyItemActions ||
                    (options.columnScroll && options.itemActionsPosition !== 'custom'))
        );
    }

    _getLadderTopOffsetStyles(): string {
        if (!this._options.ladderProperties) {
            return '';
        }

        if (!this._container) {
            return '';
        }

        // Если таблица скрыта, то вычисления размеров бессмысленны. Оставляем как есть.
        if (this._container.closest('.ws-hidden')) {
            return this._ladderTopOffsetStyles;
        }
        let headerHeight = 0;
        let resultsHeight = 0;
        let groupHeight = 0;
        const header = this._container.getElementsByClassName(
            'controls-Grid__header'
        )[0] as HTMLElement;
        const results = this._container.getElementsByClassName(
            'controls-Grid__results'
        )[0] as HTMLElement;
        const groups = this._container.getElementsByClassName('controls-ListView__groupContent');

        const hasTopResults = results && this._listModel.getResultsPosition() !== 'bottom';
        if (this._options.stickyHeader) {
            if (header) {
                headerHeight = getDimensions(header).height;
            }
            if (hasTopResults) {
                resultsHeight = getDimensions(results).height;
            }
        }
        if (this._options.stickyHeader || this._options.stickyGroup !== false) {
            const group = Array.from(groups).find((groupElement) => {
                return !groupElement.closest('.controls-ListView__groupHidden');
            }) as HTMLElement;
            if (group) {
                groupHeight = getDimensions(group).height;
            }
        }
        const topOffset = headerHeight + resultsHeight;
        const topOffsetWithGroup = topOffset + groupHeight;
        const offsetFromOptions = this._options.ladderOffset || '0px';
        const postfixLadderClass = `${header ? '_withHeader' : ''}${
            hasTopResults ? '_withResults' : ''
        }`;
        const ladderClass = `controls-Grid__row-cell__ladder-spacing${postfixLadderClass}`;
        const mainLadderClass = 'controls-Grid__row-cell__ladder-main_spacing';
        if (!(headerHeight || resultsHeight || groupHeight) && !this._options.ladderOffset) {
            return '';
        }
        return (
            `.${this._ladderOffsetSelector} .${ladderClass} {` +
            `top: calc(var(--item_line-height_l_grid) + ${offsetFromOptions} + ${topOffset}px) !important;}` +
            `.${this._ladderOffsetSelector} .${ladderClass}_withGroup {` +
            `top: calc(var(--item_line-height_l_grid) + ${offsetFromOptions} + ${topOffsetWithGroup}px) !important;}` +
            `.${this._ladderOffsetSelector} .${mainLadderClass}_withGroup {` +
            `top: calc(${offsetFromOptions} + ${topOffsetWithGroup}px) !important;}` +
            `.${this._ladderOffsetSelector} .${mainLadderClass} {` +
            `top: calc(${offsetFromOptions} + ${topOffset}px) !important;}`
        );
    }

    _getGridViewWrapperClasses(options: IGridOptions): string {
        let classes = `controls_list_theme-${options.theme} ${this._getColumnScrollWrapperClasses(
            options
        )}`;
        // Если нужно отобразить пустое представление, растягиваем grid на всю высоту
        if (this._shouldStretchEmptyTemplate(options)) {
            classes += ' controls-Grid__empty_gridWrapper';
        }
        return classes;
    }

    _getGridViewClasses(
        options: IGridOptions,
        columnScrollPartName?: 'fixed' | 'scrollable'
    ): string {
        let classes = `controls-Grid controls-Grid_${options.style} controls-Grid_part-${columnScrollPartName}`;

        if (options.isFullGridSupport) {
            classes += ' controls-Grid_grid-layout';
        }

        if (GridLadderUtil.isSupportLadder(options.ladderProperties)) {
            classes += ` controls-Grid_support-ladder ${this._ladderOffsetSelector}`;
        }

        // Если нужно отобразить пустое представление, растягиваем grid на всю высоту.
        if (this._shouldStretchEmptyTemplate(options)) {
            classes += ' controls-Grid__empty';
        }

        // Удалено в 22.1000. Быстрый фикс неправильной высоты результатов, чтобы не протягивать
        // таску через всю коллекцию до ячейки.
        if (options.task1183453766) {
            classes += ' controls-Grid__fixResultsHeight';
        }

        if (options._needBottomPadding) {
            classes += ' controls-GridView__paddingBottom__itemActionsV_outside';
            if (options.rowSeparatorSize && options.rowSeparatorSize !== 'null') {
                classes += `_size-${options.rowSeparatorSize}`;
            }
        }

        // Во время днд отключаем лесенку, а контент отображаем принудительно с помощью visibility: visible
        if (this._listModel?.isDragging()) {
            classes += ' controls-Grid_dragging_process';
        }

        classes += ` ${this._getColumnScrollContentClasses(options, columnScrollPartName)}`;
        return classes;
    }

    _getGridViewStyles(options: IGridOptions, isOnlyFixedColumns: boolean = false): string {
        let styles = GridLayoutUtil.getTemplateColumnsStyle(
            this._listModel.getColumnWidths(isOnlyFixedColumns)
        );
        // В случае отображения пустого представления надо растянуть ячейку
        // с пустым представлением на всю высоту таблицы.
        // Это можно сделать при помощи grid-template-rows.
        if (this._shouldStretchEmptyTemplate(options)) {
            styles += this._getGridEmptyTemplateRows(options);
        }
        return styles;
    }

    _shouldStretchEmptyTemplate(options: IGridOptions): boolean {
        // Для IE растягивать ничего не надо, там нельзя настроить сетку строк, как в grid.
        return (
            options.needShowEmptyTemplate &&
            options.isFullGridSupport &&
            options.emptyTemplateOptions?.height !== 'auto'
        );
    }

    reset(params: { keepScroll?: boolean } = {}): void {
        super.reset.apply(this, arguments);
        if (!params.keepScroll) {
            this._resetColumnScroll(this._options.columnScrollStartPosition);
        }
    }

    /**
     * Обработка изменения размеров View "изнутри", т.е. внутри таблицы
     * произошли изменения, которые потенциально приведут к изменению размеров таблицы/колонок.
     *
     * Изменения размеров "снаружи" сама таблица не слушает, только миксин горизонтального скролла.
     * Обработка происходит в методе ColumnScrollViewMixin._onColumnScrollViewResized
     */
    onViewResized(): void {
        super.onViewResized.apply(this, arguments);
        this._onColumnScrollViewResized();
    }

    keyDownLeft(): boolean {
        return this._onColumnScrollViewArrowKeyDown('left');
    }

    keyDownRight(): boolean {
        return this._onColumnScrollViewArrowKeyDown('right');
    }

    protected _onItemClick(event: SyntheticEvent<MouseEvent>, item: Row): void {
        const clickOnCheckbox = event.target.closest('.js-controls-ListView__checkbox');
        if (clickOnCheckbox) {
            this._notify('checkBoxClick', [item, event]);
            event.stopPropagation();
            return;
        }

        const contents = item.getContents();
        if (item['[Controls/_display/GroupItem]']) {
            this._notify('groupClick', [contents, event, item]);
            return;
        }

        this._notify('itemClick', [contents, event]);
    }

    /**
     * Необходимо проскролить таблицу горизонтально к полю ввода, которое будет активировано.
     * В противном случае, браузер проскролит всю таблицу (обертку).
     * Событие срабатывает при вводе фокуса в таблицу, до активации поля ввода и
     * только на уже редактируемой строке.
     * Логика подскрола к полю ввода при начале редактирования строки реализована в GridView.beforeRowActivated
     */
    _onFocusIn(e: SyntheticEvent): void {
        const target = e.target as HTMLElement;

        if (
            this.isColumnScrollVisible() &&
            this._listModel.isEditing() &&
            (
                (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') ||
                (target.className?.indexOf?.('js-controls-Field') !== -1)
            )
        ) {
            // Подскроливаем к ячейке с полем ввода, чтобы она была полностью видна перед активацией.
            // Если ячейка заколспанена, скролим к полю ввода, т.к. она может быть шире всей видимой области.
            const isCellColspaned = !!target.closest('.js-controls-Grid__cell_colspaned');
            const correctTarget =
                target.closest(
                    isCellColspaned ? '.js-controls-Render' : '.controls-Grid__row-cell'
                ) || target;

            this._columnScrollScrollIntoView(correctTarget);
        }
    }

    _onHeaderRowClick(event: SyntheticEvent): void {
        const target = event.target as HTMLElement;
        const headerRow = this._listModel.getHeader();

        // Если шапка зафиксирована, то нужно прокинуть событие arrowClick при клике по шеврону,
        // иначе оно не дойдет до прикладников
        if (headerRow.isSticked() && target.closest('.js-BreadCrumbsPath__backButtonArrow')) {
            event.stopPropagation();
            this._notify('arrowClick', []);
            return;
        }
    }

    protected _onItemMouseUp(event: SyntheticEvent, item: Row): void {
        const clickOnEditArrow = event.target.closest(`.${EDIT_ARROW_SELECTOR}`);
        if (clickOnEditArrow) {
            event.stopPropagation();
            return;
        }

        super._onItemMouseUp(event, item);
    }

    protected _onItemMouseDown(event: SyntheticEvent, item: Row): void {
        const clickOnEditArrow = event.target.closest(`.${EDIT_ARROW_SELECTOR}`);
        if (clickOnEditArrow) {
            event.stopPropagation();
            return;
        }

        super._onItemMouseDown(event, item);
    }

    _getStickyLadderCellsCount(options: IGridOptions): number {
        return GridLadderUtil.stickyLadderCellsCount(
            options.columns,
            options.stickyColumn,
            this._listModel.isDragging()
        );
    }

    /**
     * Необходимо проскролить таблицу горизонтально к полю ввода, которое будет активировано.
     * В противном случае, браузер проскролит всю таблицу (обертку).
     * Событие срабатывает при входе в режим редактирования, до активации поля ввода.
     * Логика подскрола к полю ввода в уже редактируемой строке реализована в GridView._onFocusIn
     */
    beforeRowActivated(target: HTMLElement): void {
        const correctTarget = target.closest('.controls-Grid__row-cell') || target;
        this._columnScrollScrollIntoView(correctTarget);
    }
}

/*
  Имя сущности для идентификации списка.
 */
Object.defineProperty(GridView.prototype, 'listInstanceName', {
    value: 'controls-Grid',
    writable: false,
    sorting: null,
});
