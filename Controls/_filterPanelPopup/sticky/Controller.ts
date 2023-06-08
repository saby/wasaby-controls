/**
 * @kaizen_zone 8005b651-a210-459a-a90d-f6ec20a122ee
 */
import { IFilterItem, getFilterByFilterDescription } from 'Controls/filter';
import { isEqual } from 'Types/object';
import * as rk from 'i18n!Controls';

export interface IFilterPanelPopupController {
    items: IFilterItem[];
}

/**
 * Контроллер для окна панели фильтров.
 *
 * @class Controls/_filterPanelPopup/sticky/Controller
 * @extends UI/Base:Control
 *
 * @private
 */
export default class FilterPanelPopupController {
    private _items: IFilterItem[];
    private readonly _initialFilter: object;

    constructor({ items }: IFilterPanelPopupController) {
        this._items = items;
        this._initialFilter = getFilterByFilterDescription({}, this._items);
    }

    /**
     * Метод, позволяющий определить наличие редакторов фильтра, которые отображаются в основной области на момент построения.
     */
    hasBasicItemsOnMount(): boolean {
        return this._items.some((item) => {
            const {
                viewMode,
                value,
                resetValue,
                extendedCaption,
                editorOptions,
            } = item;
            const extCaption =
                extendedCaption || editorOptions?.extendedCaption;
            const isResetValue = isEqual(value, resetValue);
            const isBasicViewMode = viewMode === 'basic';
            const isBasisViewModeWithExtendedCaption =
                isBasicViewMode && extCaption && isResetValue;

            // В этом случае нужно возвращать false только на _beforeMount
            if (isBasisViewModeWithExtendedCaption) {
                return false;
            }

            return this._isBasicItem(item);
        });
    }

    /**
     * Метод, позволяющий определить наличие редакторов фильтра, которые отображаются в основной области.
     */
    hasBasicItems(): boolean {
        return this._items.some((item) => {
            return this._isBasicItem(item);
        });
    }

    /**
     * Метод, инициализирующий значения для поля элементов панели фильтров.
     * @param items
     */
    setItems(items: IFilterItem[]): IFilterItem[] {
        return (this._items = items);
    }

    /**
     * Метод позволяет получить значение для заголовка окна фильтров.
     */
    getHeadingCaption(hasBasicItems: boolean): string {
        return hasBasicItems ? rk('Отбираются') : rk('Можно отобрать');
    }

    /**
     * Метод, определяющий наличие фильтров, значение которых отличается от значения по-умолчанию.
     */
    isFilterChanged(): boolean {
        return this._items.some((item) => {
            return (
                item.hasOwnProperty('resetValue') &&
                !isEqual(item.value, item.resetValue)
            );
        });
    }

    /**
     * Метод, определяющий изменилось ли значение редакторов фильтра.
     */
    isInitialFilterChanged(): boolean {
        const currentFilter = getFilterByFilterDescription({}, this._items);
        return !isEqual(currentFilter, this._initialFilter);
    }

    _isBasicItem({
        value,
        resetValue,
        viewMode,
        extendedCaption,
        editorOptions,
    }: IFilterItem): boolean {
        const extCaption = extendedCaption || editorOptions?.extendedCaption;
        return (
            viewMode === 'basic' ||
            !isEqual(value, resetValue) ||
            !viewMode ||
            (viewMode === 'frequent' && !extCaption)
        );
    }
}
