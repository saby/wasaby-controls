/**
 * @kaizen_zone e8e36b1a-d1b2-42b9-a236-b49c3be0934f
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { EventUtils, SyntheticEvent } from 'UI/Events';
import { Path } from 'Controls/dataSource';
import { IColumn, IHeaderCell } from 'Controls/grid';
import type { IResultConfig } from 'Controls/gridReact';
import { default as PathWrapper } from './PathWrapper';
import type { IHeadingPath } from 'Controls/breadcrumbs';
import * as GridIsEqualUtil from 'Controls/Utils/GridIsEqualUtil';
import { isEqual } from 'Types/object';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { calculateBreadcrumbsLayout, IBreadcrumbsLayout } from 'Controls/_explorer/utils';
import { IExplorerOptions, TExplorerViewMode } from 'Controls/_explorer/interface/IExplorer';
import * as template from 'wml!Controls/_explorer/PathController/PathController';
import * as headerBreadcrumbs from 'wml!Controls/_explorer/templates/HeaderCell';
import * as resultBreadcrumbs from 'wml!Controls/_explorer/templates/ResultCell';
import HeaderBreadcrumbsComponent from 'Controls/_explorer/components/HeaderBreadcrumbs';

interface IOptions extends IControlOptions, IExplorerOptions {
    breadCrumbsItems: Path;
    rootVisible: boolean;
    highlighter: Function;
    displayProperty: string;
    showActionButton: boolean;
    backButtonStyle: string;
    backButtonCaption: string;
    backButtonIconStyle: string;
    backButtonFontColorStyle: string;
}

function isItemsEqual(oldItems: Path, newItems: Path): boolean {
    if ((!oldItems && newItems) || (oldItems && !newItems)) {
        return false;
    }

    if (!oldItems && !newItems) {
        return true;
    }

    return (
        oldItems.length === newItems.length &&
        oldItems.reduce((acc, prev, index) => {
            return acc && prev.isEqual(newItems[index]);
        }, true)
    );
}

/**
 * * Если возможно, то патчит первую ячейку заголовка таблицы добавляя туда хлебные крошки.
 * * Вычисляет нужна ли тень у хлебных крошек.
 * * Обрабатывает клик по кнопке назад из заголовка таблицы.
 * * Предоставляет метод goBack, который инициирует возвращение на предыдущий уровень в иерархии проваливания
 * @private
 */
export default class PathController extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        path: PathWrapper;
    };

    protected _columns: IColumn[];
    protected _results: IResultConfig[];
    protected _header: IHeaderCell[];
    // Рисовать или нет элемент с крошками над списком
    protected _drawTop: boolean = false;
    protected _topWithoutBackButton: boolean = false;
    protected _needShadow: boolean = false;
    protected _crumbsVisible: boolean = false;
    // Текущая конфигурация макета для отображения крошек
    protected _breadcrumbsLayout: IBreadcrumbsLayout;

    protected _notifyHandler: typeof EventUtils.tmplNotify = EventUtils.tmplNotify;

    // region life circle hooks
    protected _beforeMount(options: IOptions): void {
        this._updateBreadcrumbsLayout(options);
        this._needShadow = PathController._isNeedShadow(this._header, options.viewMode);
    }

    protected _beforeUpdate(newOptions: IOptions): void {
        this._updateBreadcrumbsLayout(newOptions);

        const headerChanged = !GridIsEqualUtil.isEqualWithSkip(
            this._options.header,
            newOptions.header,
            { template: true }
        );

        if (
            headerChanged ||
            !isItemsEqual(this._options.breadCrumbsItems, newOptions.breadCrumbsItems) ||
            this._options.rootVisible !== newOptions.rootVisible ||
            this._options.multiSelectVisibility !== newOptions.multiSelectVisibility
        ) {
            this._needShadow = PathController._isNeedShadow(this._header, newOptions.viewMode);
        }

        if (this._options.viewMode !== newOptions.viewMode) {
            this._needShadow = PathController._isNeedShadow(this._header, newOptions.viewMode);
        }

        if (this._children.hasOwnProperty('path')) {
            this._crumbsVisible = this._children.path.isCrumbsVisible(newOptions);
        }
    }
    // endregion

    /**
     * Инициирует возвращение на предыдущий уровень в иерархии проваливания
     */
    goBack(e: Event): void {
        if (!this._options.breadCrumbsItems?.length) {
            return;
        }

        import('Controls/breadcrumbs').then((breadcrumbs) => {
            breadcrumbs.HeadingPathCommon.onBackButtonClick.call(this, e, 'breadCrumbsItems');
        });
    }

    protected _onHeaderArrowClick(event: SyntheticEvent): void {
        event.stopSyntheticEvent();
        this._notify('arrowClick', []);
    }

    protected _onHeaderArrowActivated(event: SyntheticEvent): void {
        event.stopSyntheticEvent();
        this._notify('arrowActivated', []);
    }

    protected _onHeaderBreadcrumbsClick(event: SyntheticEvent, item: Model): void {
        this._notify('itemClick', [item], { bubbling: false });
    }

    /**
     * На основании переданных опций обновляет {@link _breadcrumbsLayout} и выполняет
     * необходимые патчи конфигурации.
     */
    private _updateBreadcrumbsLayout(options: IOptions): void {
        const newBreadcrumbsLayout = calculateBreadcrumbsLayout(
            options,
            options.sourceController && options.sourceController.getItems()
        );

        const newDrawTop =
            !!options.afterBreadCrumbsTemplate ||
            newBreadcrumbsLayout.backButtonPosition === 'top' ||
            newBreadcrumbsLayout.breadcrumbsPosition === 'top';

        const newTopWithoutBackButton =
            newBreadcrumbsLayout.backButtonPosition === 'header' ||
            newBreadcrumbsLayout.backButtonPosition === 'results';

        if (
            !isEqual(newBreadcrumbsLayout, this._breadcrumbsLayout) ||
            this._options.root !== options.root ||
            this._options.header !== options.header ||
            this._options.columns !== options.columns ||
            this._options.results !== options.results ||
            newTopWithoutBackButton !== this._topWithoutBackButton ||
            newDrawTop !== this._drawTop
        ) {
            this._breadcrumbsLayout = newBreadcrumbsLayout;
            // Определимся нужно ли рисовать элемент на списком
            this._drawTop = newDrawTop;
            this._topWithoutBackButton = newTopWithoutBackButton;

            this._header = patchHeader(this._breadcrumbsLayout, options);
            this._columns = patchColumns(this._breadcrumbsLayout, options);
            this._results = patchResults(this._breadcrumbsLayout, options);
        }
    }

    /**
     * Определяет нужно ли рисовать тень у StickyHeader в котором лежат хлебные крошки
     */
    private static _isNeedShadow(header: IHeaderCell[], viewModel: TExplorerViewMode): boolean {
        // В табличном представлении если есть заголовок, то тень будет под ним,
        // и нам не нужно рисовать ее под хлебными крошками. В противном случае
        // тень у StickyHeader нужна всегда.
        return viewModel !== 'table' || !header;
    }
}

/**
 * Если крошки должны отображаться в заголовке таблицы, то патчим первую ячейку заголовка таблицы
 * добавляя туда хлебные крошки.
 */
function patchHeader(breadcrumbsLayout: IBreadcrumbsLayout, options: IOptions): IHeaderCell[] {
    if (
        breadcrumbsLayout.breadcrumbsPosition !== 'header' &&
        breadcrumbsLayout.backButtonPosition !== 'header'
    ) {
        return options.header;
    }

    const newHeader = [...options.header];
    newHeader[0] = { ...options.header[0] };

    newHeader[0].isBreadCrumbs =
        breadcrumbsLayout.backButtonPosition === 'header' &&
        options.backButtonIconViewMode !== 'functionalButton';

    const breadcrumbsOptions = getResultsBackButtonOptions(
        'header',
        breadcrumbsLayout,
        options
    ) as Partial<IHeadingPath>;

    newHeader[0].template = headerBreadcrumbs;
    newHeader[0].templateOptions = breadcrumbsOptions;
    newHeader[0].render = React.createElement(HeaderBreadcrumbsComponent, {
        breadcrumbsOptions,
    });

    if (
        breadcrumbsLayout.backButtonPosition === 'header' &&
        options.backButtonIconViewMode === 'functionalButton'
    ) {
        for (let i = 0; i < newHeader.length; i++) {
            newHeader[i].baseline = '4xl';
        }
    }

    return newHeader;
}

/**
 * Если кнопка "Назад" должна отображаться в итогах таблицы, то патчим первую колонку таблицы
 * добавляя туда нашу кнопку.
 */
function patchColumns(breadcrumbsLayout: IBreadcrumbsLayout, options: IOptions): IColumn[] {
    if (breadcrumbsLayout.backButtonPosition !== 'results') {
        return options.columns;
    }

    const newColumns = [...options.columns];
    newColumns[0] = { ...options.columns[0] };
    newColumns[0].resultTemplate = resultBreadcrumbs;
    (newColumns[0] as { breadcrumbsOptions: object }).breadcrumbsOptions =
        getResultsBackButtonOptions('results', breadcrumbsLayout, options);

    if (options.backButtonIconViewMode === 'functionalButton') {
        for (let i = 0; i < newColumns.length; i++) {
            newColumns[i].resultBaseline = '4xl';
        }
    }

    return newColumns;
}

function patchResults(breadcrumbsLayout: IBreadcrumbsLayout, options: IOptions): IResultConfig[] {
    if (breadcrumbsLayout.backButtonPosition !== 'results' || !(options.results instanceof Array)) {
        return options.results;
    }

    const breadcrumbsOptions = getResultsBackButtonOptions('results', breadcrumbsLayout, options);
    const newResults = [...options.results];
    newResults[0] = { ...options.results[0] };
    newResults[0].render = React.createElement(HeaderBreadcrumbsComponent, {
        breadcrumbsOptions,
    });

    if (options.backButtonIconViewMode === 'functionalButton') {
        for (let i = 0; i < newResults.length; i++) {
            newResults[i].getCellProps = (item) => {
                const superResult = newResults[i]?.getCellProps?.(item) || {};
                return {
                    ...superResult,
                    baseline: '4xl',
                };
            };
        }
    }

    return newResults;
}

function getResultsBackButtonOptions(
    target: 'header' | 'results',
    breadcrumbsLayout: IBreadcrumbsLayout,
    options: IOptions
): object {
    return {
        items: options.breadCrumbsItems,
        keyProperty: options.keyProperty,
        parentProperty: options.parentProperty,
        displayProperty: options.displayProperty,

        showActionButton: !!options.showActionButton,
        showArrowOutsideOfBackButton: !!options.showActionButton,

        rootVisible: options.rootVisible,
        highlighter: options.highlighter,

        backButtonStyle: options.backButtonStyle,
        backButtonIconStyle: options.backButtonIconStyle,
        backButtonIconViewMode: options.backButtonIconViewMode,
        backButtonFontColorStyle: options.backButtonFontColorStyle,
        backButtonBeforeCaptionTemplate: options.backButtonBeforeCaptionTemplate,
        withoutBackButton:
            breadcrumbsLayout.backButtonPosition !== (target === 'header' ? 'header' : 'results'),
        withoutBreadcrumbs:
            breadcrumbsLayout.breadcrumbsPosition !== (target === 'header' ? 'header' : 'results'),
    };
}
