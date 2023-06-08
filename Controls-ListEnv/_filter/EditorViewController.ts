import { IControlOptions } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { IChipsOptions } from 'Controls/Chips';
import { ITumblerOptions } from 'Controls/Tumbler';
import { TKey, IItemsOptions } from 'Controls/interface';
import { IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';

const CONTROL_FILTER_NAME_INDEX = 0;

export interface IFilterViewWidgetOptions
    extends IControlOptions,
        IInnerWidgetOptions {
    detailPanelWidth?: string;
    detailPanelOrientation: 'horizontal' | 'vertical';
    detailPanelExtendedItemsViewMode?: 'column' | 'row';
}

export interface IEditorViewControllerOptions
    extends IItemsOptions<object>,
        IFilterViewWidgetOptions {
    displayProperty: string;
}

/**
 * Контроллер редакторов фильтра.
 * @class Controls-ListEnv/_filter/EditorViewController
 * @extends UI/Base:Control
 * @public
 */
export default class EditorViewController<
    EditorOptions = IChipsOptions | ITumblerOptions
> {
    protected _selectedKeys: KeyType = null;
    protected _editorOptions: EditorOptions;
    private _filterName: string;
    private _displayProperty: string;
    private _items: RecordSet<object>;

    constructor(options: IEditorViewControllerOptions) {
        this.updateOptions(options);
    }

    updateOptions(options: IEditorViewControllerOptions): void {
        const { filterNames, displayProperty, items } = options;
        this.setFilterName(filterNames);
        this.setDisplayProperty(displayProperty);
        this.setItems(items);
    }

    /**
     * Метод устанавливает значение для поля displayProperty.
     * @param name
     */
    setDisplayProperty(name: string): void {
        if (this._displayProperty !== name) {
            this._displayProperty = name;
        }
    }

    /**
     * Метод инициализрует значение поля displayProperty.
     * @param name
     */
    getDisplayProperty(): string {
        return this._editorOptions.displayProperty || this._displayProperty;
    }

    /**
     * Метод инициализирует элементы фильтра.
     * @param items
     */
    setItems(items: RecordSet<object>): void {
        this._items = items;
    }

    /**
     * Метод полуает элементы фильтра.
     */
    getItems(): RecordSet<object> {
        return this._editorOptions?.items || this._items;
    }

    /**
     * Метод устанавливает значение для поля с именем фильтра.
     * @param filterNames
     */
    setFilterName(filterNames: string[]): string {
        const filterName = filterNames[CONTROL_FILTER_NAME_INDEX];
        if (filterName !== this._filterName) {
            this._filterName = filterName;
        }
        return this._filterName;
    }

    /**
     * Метод получает значение поля с именем фильтра.
     */
    getFilterName(): string {
        return this._filterName;
    }

    /**
     * Метод устанавливает значение для поля с конфигом для редактора фильтра.
     * @param editorOptions
     */
    setEditorsOptions(editorOptions: EditorOptions): EditorOptions {
        this._editorOptions = editorOptions;
        return this._editorOptions;
    }

    /**
     * Метод получает значение поля с конфигом для редактора фильтра.
     */
    getEditorOptions(): EditorOptions {
        return this._editorOptions;
    }

    /**
     * Метод получает ключи выбранных значений.
     */
    getSelectedKeys(): TKey | TKey[] {
        return this._selectedKeys;
    }

    /**
     * Метод получает источник по имени фильтра.
     */
    getFilterSourceByValue(
        selectedKeys: TKey | TKey[],
        filterSource: IFilterItem[]
    ): IFilterItem[] {
        if (!filterSource) {
            return;
        }
        return filterSource.map((item) => {
            const newItem = { ...item };

            if (newItem.name === this._filterName) {
                newItem.value = selectedKeys;
                newItem.textValue = this._getTextValues(selectedKeys);
            }

            return newItem;
        });
    }

    /**
     * Метод получает текстовое значение для редакторов фильтра.
     * param selectedKeys
     */
    private _getTextValues(selectedKeys: TKey | TKey[]): string {
        if (Array.isArray(selectedKeys)) {
            const textValues = [];
            selectedKeys.forEach((key) => {
                const text = this._getTextValue(key);
                textValues.push(text);
            });
            return textValues.join(', ');
        }

        return this._getTextValue(selectedKeys);
    }

    /**
     * Метод получает текстовое значение для редактора фильтра.
     * @param selectedKey
     */
    private _getTextValue(selectedKey: TKey | TKey[]): string {
        const displayProperty = this.getDisplayProperty();
        const items = this.getItems();
        const item = items.getRecordById(selectedKey);
        return item.get(displayProperty || 'title') || item.get('caption');
    }

    /**
     * Метод получает конфиг для редактора фильтра по имени.
     * @param filterSource
     */
    getEditorItem(filterSource: IFilterItem[]): IFilterItem {
        return filterSource.find(({ name }) => {
            return name === this._filterName;
        });
    }
}
