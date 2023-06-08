/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { IFilterOptions, ISourceOptions, TKey, ISelectFieldsOptions } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { process } from 'Controls/error';
import { RecordSet, List } from 'Types/collection';
import { Model } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { ToSourceModel } from 'Controls/_lookup/resources/ToSourceModel';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { constants } from 'Env/Constants';
import { create as DiCreate } from 'Types/di';

type Key = string | number | null;
export type SelectedItems = RecordSet | List<Model> | List<void>;

export interface ILookupBaseControllerOptions
    extends IFilterOptions,
        ISourceOptions,
        ISelectFieldsOptions {
    selectedKeys: Key[];
    dataLoadCallback?: Function;
    dataLoadErrback?: Function;
    multiSelect?: boolean;
    displayProperty: string;
    historyId: string;
    items?: RecordSet;
    maxVisibleItems?: number;
    lazyItemsLoading: boolean;
}

const clone = object.clone;

export default class LookupBaseControllerClass {
    private _options: ILookupBaseControllerOptions;
    private _selectedKeys: Key[];
    private _loadedKeys: Key[] = [];
    private _sourceController: SourceController;
    private _items: SelectedItems;
    private _historyServiceLoad: Promise<unknown>;

    constructor(options: ILookupBaseControllerOptions) {
        this._options = options;
        this._setSelectedKeys(options.selectedKeys ? options.selectedKeys.slice() : []);
    }

    update(newOptions: ILookupBaseControllerOptions): Promise<RecordSet> | boolean {
        const hasSelectedKeysInOptions = newOptions.selectedKeys !== undefined;
        const itemsChanged =
            this._options.items !== newOptions.items && this._items !== newOptions.items;
        let keysChanged;

        if (hasSelectedKeysInOptions) {
            keysChanged =
                !isEqual(newOptions.selectedKeys, this._options.selectedKeys) ||
                !isEqual(newOptions.selectedKeys, this.getSelectedKeys());
        }

        const sourceIsChanged = newOptions.source !== this._options.source;
        const isKeyPropertyChanged = newOptions.keyProperty !== this._options.keyProperty;
        let updateResult;

        this._options = newOptions;

        if (sourceIsChanged && this._sourceController) {
            this._sourceController.destroy();
            this._sourceController = null;
        }

        if (itemsChanged) {
            updateResult = true;
            this._setItems(newOptions.items);

            if (!keysChanged) {
                this._setSelectedKeys(this._getSelectedKeysByItems());
            }
        }

        if (keysChanged || (sourceIsChanged && hasSelectedKeysInOptions)) {
            this._setSelectedKeys(newOptions.selectedKeys.slice());
        } else if (isKeyPropertyChanged) {
            this._setSelectedKeys(this._getSelectedKeysByItems());
        }

        if (!newOptions.multiSelect && this._selectedKeys.length > 1) {
            this._clearItems();
            updateResult = true;
        } else if (sourceIsChanged || keysChanged) {
            if (this._selectedKeys.length) {
                if (this._needLoadItems() || (sourceIsChanged && !itemsChanged)) {
                    const keysForLoad = this.getKeysForLoad();
                    updateResult = this.loadItems(keysForLoad);
                }
            } else if (keysChanged && this.getItems().getCount()) {
                this._clearItems();
                updateResult = true;
            }
        }

        return updateResult;
    }

    loadItems(keysForLoad: Key[] = this._selectedKeys): Promise<SelectedItems | Error> {
        const options = this._options;
        const filter = { ...options.filter };
        const keyProperty = this._getKeyProperty(options) as string;

        filter[keyProperty] = keysForLoad;

        const sourceController = this._getSourceController(this._options);
        sourceController.setFilter(filter);
        return sourceController.load().then(
            (items) => {
                this.setLoadedKeys(keysForLoad);
                if (!constants.isProduction) {
                    this._checkLoadedItems(items as RecordSet, this._loadedKeys, keyProperty);
                }

                if (options.dataLoadCallback) {
                    options.dataLoadCallback(items);
                }

                return items;
            },
            (error) => {
                process({ error });
                return new List();
            }
        );
    }

    setItems(items: SelectedItems): Key[] {
        const selectedKeys: Key[] = [];
        const selectedKeysMap = {};
        let isItemsOK = true;

        items.each((item) => {
            // FIXME удалить item.getKey() после
            // https://online.sbis.ru/opendoc.html?guid=376cc90d-8bb3-41cc-829b-57bfed67c90d
            const key = item.get(this._options.keyProperty) || item.getKey();

            if (!selectedKeysMap[key]) {
                selectedKeys.push(key);
                selectedKeysMap[key] = true;
            } else {
                isItemsOK = false;
                Logger.error(
                    'Controls/lookup: встречены записи с одинаковыми ключами. Проверьте ответ метода БЛ, выполняющего загрузку записей для lookup'
                );
            }
        });

        if (isItemsOK) {
            this._setItems(items);
            return selectedKeys;
        }
    }

    setItemsAndSelectedKeys(items: SelectedItems): void {
        const selectedKeys = this.setItems(items);
        if (selectedKeys) {
            this._setSelectedKeys(selectedKeys);
        }
    }

    getItems(): SelectedItems {
        return this._getItems();
    }

    setItemsAndSaveToHistory(items: SelectedItems): void | Promise<unknown> {
        this.setItemsAndSelectedKeys(this._prepareItems(items));
        if (items && items.getCount() && this._options.historyId) {
            return this._getHistoryService().then((historyService) => {
                // @ts-ignore
                historyService.update({ ids: this._selectedKeys }, { $_history: true });
                return historyService;
            });
        }
    }

    addItem(item: Model): boolean {
        const key = item.get(this._options.keyProperty);
        const newItems = [item];
        let isChanged = false;

        if (!this.getSelectedKeys().includes(key)) {
            const items = this._cloneItems(this._getItems());
            let selectedKeys = this.getSelectedKeys().slice();

            isChanged = true;

            if (this._options.saveFormat) {
                // TODO: https://online.sbis.ru/opendoc.html?guid=88f75f66-5f00-475f-aa62-8238d74f23f8&client=3
                // если форматы записей в справочнике и автодополнении различаются,
                // добавим поля keyProperty и displayProperty, если их нет в текущем рекордсете
                this._prepareFormat(items, item);
            }
            if (this._options.multiSelect) {
                selectedKeys.push(key);
                items.append(newItems);
            } else {
                selectedKeys = [key];
                items.assign(newItems);
            }

            this._setItems(this._prepareItems(items));
            this._setSelectedKeys(selectedKeys);
        }

        return isChanged;
    }

    removeItem(item: Model): boolean {
        const keyProperty =
            this._getKeyProperty(this._options) || (item.getKeyProperty() as string);
        // FIXME удалить item.getKey() после
        // https://online.sbis.ru/opendoc.html?guid=376cc90d-8bb3-41cc-829b-57bfed67c90d
        const key = item.get(keyProperty) || item.getKey();
        let isChanged = false;
        let selectedKeys = this.getSelectedKeys();

        if (selectedKeys.includes(key)) {
            const selectedItems = this._cloneItems(this._getItems());

            isChanged = true;
            selectedKeys = selectedKeys.slice();
            selectedKeys.splice(selectedKeys.indexOf(key), 1);
            selectedItems.removeAt(selectedItems.getIndexByValue(keyProperty, key));

            this._setSelectedKeys(selectedKeys);
            this._setItems(selectedItems);
        }

        return isChanged;
    }

    getSelectedKeys(): Key[] {
        return this._selectedKeys;
    }

    getKeysForLoad(): Key[] {
        if (this._options.lazyItemsLoading) {
            return this.getSelectedKeys().slice(0, this._options.maxVisibleItems);
        }
        return this.getSelectedKeys();
    }

    getLoadedKeys(): Key[] {
        return this._loadedKeys;
    }

    setLoadedKeys(keys: Key[]): void {
        this._loadedKeys = keys;
    }

    getTextValue(): string {
        const stringValues = [];
        this._getItems().each((item) => {
            stringValues.push(item.get(this._options.displayProperty));
        });
        return stringValues.join(', ');
    }

    destroy(): void {
        this._getHistoryService().then((historyService) => {
            historyService.destroy();
        });
    }

    private _setSelectedKeys(keys: Key[]): void {
        if (keys.length > 1 && !this._options.multiSelect) {
            Logger.error(
                'Controls/lookup: передано несколько ключей в опции selectedKeys для поля с единичным выбором (опция multiSelect: false)'
            );
        }
        this._selectedKeys = keys;
    }

    private _getSelectedKeysByItems(): TKey[] {
        const selectedKeys = [];
        this._getItems().each((item) => {
            selectedKeys.push(item.get(this._options.keyProperty));
        });
        return selectedKeys;
    }

    private _setItems(items: SelectedItems): void {
        this._items = items;
        this.setLoadedKeys(this._getSelectedKeysByItems());
    }

    private _clearItems(): void {
        this._setItems(new List());
    }

    private _getItems(): SelectedItems {
        if (!this._items) {
            this._items = new List();
        }
        return this._items;
    }

    private _prepareItems(items: SelectedItems): SelectedItems {
        return ToSourceModel(items, this._options.source, this._options.keyProperty);
    }

    private _getSourceController(options: ILookupBaseControllerOptions): SourceController {
        this._sourceController = new SourceController({
            source: options.source,
            keyProperty: options.keyProperty,
            selectFields: options.selectFields,
        });
        return this._sourceController;
    }

    private _getHistoryService(): Promise<unknown> {
        if (!this._historyServiceLoad) {
            this._historyServiceLoad = import('Controls/suggestPopup').then(({ LoadService }) => {
                return LoadService({ historyId: this._options.historyId });
            });
        }
        return this._historyServiceLoad;
    }

    private _needLoadItems(): boolean {
        const itemsKeys = [];

        this._getItems().forEach((item) => {
            return itemsKeys.push(item.getKey());
        });
        return (
            this._getItems().getCount() !== this.getSelectedKeys().length ||
            this.getSelectedKeys().some((key) => {
                return !itemsKeys.includes(key);
            })
        );
    }

    private _getKeyProperty(options: ILookupBaseControllerOptions): string | void {
        const keyProperty = this._getSourceController(options).getKeyProperty();

        /* если в опциях нет сорса, то тут всегда будет undefined,
        есть ошибка чтоб разобраться - https://online.sbis.ru/opendoc.html?guid=b0b24f57-c4a1-4743-9f16-6c7da3cfd16d
        if (!keyProperty) {
            Logger.error('Lookup: Option "keyProperty" is required.');
        }
        */

        return keyProperty;
    }

    private _checkLoadedItems(items: RecordSet, selectedKeys: Key[], keyProperty: string): void {
        const processError = (message: string) => {
            if (this._options.dataLoadErrback) {
                const error = new Error(message);
                error.name = 'lookupKeyError';
                this._options.dataLoadErrback(error);
            } else {
                Logger.error(message);
            }
        };
        items.each((item) => {
            const key = item.get(keyProperty);
            if (selectedKeys.indexOf(key) === -1) {
                processError(`Controls/lookup: ошибка при загрузке записи с ключом ${key}.
                              Необходимо проверить, что метод корректно вернул данные.`);
            }
        });
        selectedKeys.forEach((key) => {
            if (items.getIndexByValue(keyProperty, key) === -1) {
                processError(`Controls/lookup: ошибка при загрузке записи с ключом ${key}.
                              Необходимо проверить, что метод корректно вернул данные.`);
            }
        });
    }

    private _cloneItems(items: SelectedItems): SelectedItems {
        if (items['[Types/_entity/CloneableMixin]']) {
            // здесь нельзя использовать поверхностное клонирование ( items.clone(true) )
            // при поверхностном клонировании сырые данные в рекордсете
            // всё равно будут меняться по ссылке при изменении
            return items.clone();
        }
        return clone(items);
    }

    private _prepareFormat(items: RecordSet, item: Model): void {
        if (items && items instanceof RecordSet) {
            const format = items.getFormat();
            const newFormat = item.getFormat();
            newFormat.forEach((field) => {
                if (format.getFieldIndex(field.getName()) === -1) {
                    items.addField({
                        name: field.getName(),
                        type: field.getType(),
                        defaultValue: field.getDefaultValue(),
                    });
                }
            });
        }
    }

    private _isEqualFormat(oldList: RecordSet, item: Model): boolean {
        const oldListIsRecordSet = oldList && oldList['[Types/_collection/RecordSet]'];
        if (oldListIsRecordSet) {
            const oldFormat = oldListIsRecordSet && oldList.getFormat(true);
            const newFormat =
                item && item['[Types/_entity/FormattableMixin]'] && item.getFormat(true);
            return oldFormat && newFormat && oldFormat.isEqual(newFormat);
        }
        return true;
    }
}
