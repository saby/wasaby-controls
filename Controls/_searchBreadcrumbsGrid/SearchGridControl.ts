import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import {
    TreeGridControl,
    ITreeGridControlOptions,
    ITreeGridCollectionOptions,
} from 'Controls/treeGrid';
import { TSearchNavigationMode } from 'Controls/interface';
import 'Controls/baseDecorator';
import { getKey } from 'Controls/baseList';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';

export interface ISearchGridControlOptions extends ITreeGridControlOptions {
    searchNavigationMode?: TSearchNavigationMode;
    containerWidth?: number;
    breadCrumbsMode?: 'row' | 'cell';
    _initBreadCrumbsMode?: 'row' | 'cell';
}

export default class SearchGridControl<
    T extends ISearchGridControlOptions
> extends TreeGridControl<T> {
    private _itemClickNotifiedByPathClick: boolean = false;

    constructor(...args: unknown[]) {
        super(...args);
        this._onBreadcrumbItemClick = this._onBreadcrumbItemClick.bind(this);
    }

    protected _getModelOptions(options: T): Partial<ITreeGridCollectionOptions> {
        return {
            ...super._getModelOptions?.(options),
            onBreadcrumbItemClick: this._onBreadcrumbItemClick
        };
    }

    protected _beforeMount(
        options: T,
        contexts?: object
    ): ReturnType<TreeGridControl['_beforeMount']> {
        const superResult = super._beforeMount(options, contexts);

        if (options.breadCrumbsMode === 'cell' || options._initBreadCrumbsMode === 'cell') {
            this._listViewModel.setColspanBreadcrumbs(false);
        }

        return superResult;
    }

    _beforeUpdate(newOptions: T, contexts?: object): void {
        super._beforeUpdate(newOptions, contexts);

        let colspan = newOptions.breadCrumbsMode === 'row';
        // Если сказано что нужно колспанить строку с крошками и виден скрол колонок
        // то нужно принудительно сбросить колспан иначе содержимое строки с хлебными
        // крошками будет скролиться вместе с колонками
        if (colspan && newOptions.columnScroll && this.isColumnScrollVisible()) {
            colspan = false;
        }

        this._listViewModel.setColspanBreadcrumbs(colspan);

        if (this._options.breadCrumbsMode !== newOptions.breadCrumbsMode) {
            this._listViewModel.setBreadCrumbsMode(newOptions.breadCrumbsMode);
        }
        if (this._options.containerWidth !== newOptions.containerWidth) {
            this._listViewModel.setContainerWidth(newOptions.containerWidth);
        }
    }

    protected _onItemClick(
        e: SyntheticEvent,
        contents: Model | Model[],
        originalEvent: SyntheticEvent<MouseEvent>,
        _columnIndex: number = undefined
    ) {
        const item = this._getCollectionItem(contents);

        if (
            item['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]'] &&
            this._options.searchNavigationMode === 'readonly'
        ) {
            e.stopPropagation();
            return;
        }

        if (e.target.closest('.js-controls-ListView__checkbox')) {
            this._onCheckBoxClick(e, item, e);
            return;
        }

        if (item['[Controls/_display/SearchSeparator]']) {
            e.stopPropagation();
            return;
        }

        if (item['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]']) {
            this._onBreadcrumbClick(e, item);
            return;
        }

        super._onItemClick(e, contents, originalEvent, _columnIndex);
    }

    protected _onBreadcrumbClick(e: SyntheticEvent, item: BreadcrumbsItemRow<Model[]>): void {
        if (!this._itemClickNotifiedByPathClick) {
            const lastBreadcrumbItem = item.getContents()[item.getContents().length - 1];
            if (lastBreadcrumbItem) {
                // Хлебная крошка всегда занимает одну ячейку
                super._onItemClick(e, item, e, 0);
            }
        }
        this._itemClickNotifiedByPathClick = false;
        e.stopPropagation();
    }

    protected _onBreadcrumbItemClick(e: SyntheticEvent, item: Model): void {
        if (this._options.searchNavigationMode === 'readonly') {
            e.stopPropagation();
            return;
        }
        super._onItemClick(e, item, e, 0);
        this._itemClickNotifiedByPathClick = true;
    }

    protected _itemMouseUp(e: SyntheticEvent, item, domEvent: MouseEvent): void {
        if (item['[Controls/_display/SearchSeparator]']) {
            e.stopPropagation();
            return;
        }
        super._itemMouseUp(e, item, domEvent);
    }

    protected _itemMouseDown(e: SyntheticEvent, item, domEvent: MouseEvent): void {
        if (item['[Controls/_display/SearchSeparator]']) {
            e.stopPropagation();
            return;
        }
        super._itemMouseDown(e, item, domEvent);
    }

    private _getCollectionItem(item: Model | Model[]) {
        return this._listViewModel.getItemBySourceKey(getKey(item), false);
    }

    static readonly '[Controls/searchBreadcrumbsGrid:SearchGridControl]': true = true;

    // static getDefaultOptions(): Object {
    //     return {
    //         breadCrumbsMode: 'row',
    //         itemPadding: {
    //             left: 'S',
    //         },
    //     };
    // }
}
