/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TreeGridView } from 'Controls/treeGrid';
import { SyntheticEvent } from 'UI/Vdom';
import SearchGridDataRow from 'Controls/_searchBreadcrumbsGrid/display/SearchGridDataRow';
import { Model } from 'Types/entity';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import 'Controls/baseDecorator';
import SearchGridCollection from 'Controls/_searchBreadcrumbsGrid/display/SearchGridCollection';
import { ITreeGridOptions } from 'Controls/treeGrid';
import { TSearchNavigationMode } from 'Controls/interface';

export interface IOptions extends ITreeGridOptions {
    searchNavigationMode?: TSearchNavigationMode;
    containerWidth?: number;
    breadCrumbsMode?: 'row' | 'cell';
    _initBreadCrumbsMode?: 'row' | 'cell';
}

export default class SearchView extends TreeGridView {
    private _itemClickNotifiedByPathClick: boolean = false;
    protected _options: IOptions;

    protected _listModel: SearchGridCollection;

    _beforeMount(options: IOptions): Promise<void> {
        this._onBreadcrumbItemClick = this._onBreadcrumbItemClick.bind(this);
        const superMountResult = super._beforeMount(options);
        if (options.breadCrumbsMode === 'cell' || options._initBreadCrumbsMode === 'cell') {
            this._listModel.setColspanBreadcrumbs(false);
        }
        return superMountResult;
    }

    _beforeUpdate(newOptions: IOptions): void {
        super._beforeUpdate(newOptions);

        let colspan = newOptions.breadCrumbsMode === 'row';
        // Если сказано что нужно колспанить строку с крошками и виден скрол колонок
        // то нужно принудительно сбросить колспан иначе содержимое строки с хлебными
        // крошками будет скролиться вместе с колонками
        if (colspan && newOptions.columnScroll && this.isColumnScrollVisible()) {
            colspan = false;
        }

        this._listModel.setColspanBreadcrumbs(colspan);

        if (this._options.breadCrumbsMode !== newOptions.breadCrumbsMode) {
            this._listModel.setBreadCrumbsMode(newOptions.breadCrumbsMode);
        }
        if (this._options.containerWidth !== newOptions.containerWidth) {
            this._listModel.setContainerWidth(newOptions.containerWidth);
        }
    }

    protected _onBreadcrumbClick(e: SyntheticEvent, item: BreadcrumbsItemRow<Model[]>): void {
        if (!this._itemClickNotifiedByPathClick) {
            const lastBreadcrumbItem = item.getContents()[item.getContents().length - 1];
            if (lastBreadcrumbItem) {
                // Хлебная крошка всегда занимает одну ячейку
                this._notify('itemClick', [lastBreadcrumbItem, e, 0], {
                    bubbling: true,
                });
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
        this._notify('itemClick', [item, e], { bubbling: true });
        this._itemClickNotifiedByPathClick = true;
    }

    protected _onItemMouseUp(e: SyntheticEvent, item: SearchGridDataRow<Model>): void {
        if (item['[Controls/_display/SearchSeparator]']) {
            e.stopPropagation();
            return;
        }
        super._onItemMouseUp(e, item);
    }

    protected _onItemMouseDown(e: SyntheticEvent, item: SearchGridDataRow<Model>): void {
        if (item['[Controls/_display/SearchSeparator]']) {
            e.stopPropagation();
            return;
        }
        super._onItemMouseDown(e, item);
    }

    protected _onItemClick(e: SyntheticEvent, item: SearchGridDataRow<Model>) {
        if (e.target.closest('.js-controls-ListView__checkbox')) {
            this._notify('checkBoxClick', [item, e]);
            return;
        }

        if (
            item['[Controls/_searchBreadcrumbsGrid/BreadcrumbsItemRow]'] &&
            this._options.searchNavigationMode === 'readonly'
        ) {
            e.stopPropagation();
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

        super._onItemClick(e, item);
    }

    static getDefaultOptions(): Object {
        return {
            breadCrumbsMode: 'row',
            itemPadding: {
                left: 'S',
            },
        };
    }
}
