/**
 * @kaizen_zone 0e107c1a-ee17-427f-b2a9-c869f977e22d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import template = require('wml!Controls-TabsLayout/_coloredGrid/ColoredTabsGrid');
import { SbisService, Memory, PrefetchProxy } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { TKeySelection, TKeysSelection } from 'Controls/interface';
import { IContextOptionsValue } from 'Controls/context';
import randomId = require('Core/helpers/Number/randomId');
import { IItemTab } from 'Controls-TabsLayout/_colored/View';
import { TKey } from 'Controls/interface';
import 'css!Controls-TabsLayout/coloredGrid';

/**
 * @typedef {Object} ITabOptions
 * @description Опции для шаблона цветной вкладки.
 * @property {String} style Стиль {@link https://wi.sbis.ru/docs/js/Controls/interface/IFontColorStyle/options/fontColorStyle/ цвета} вкладки.
 * @property {Types/source:SbisService | Types/source:Memory} [source] Источник данных.
 * Возвращает {@link Types/collection:RecordSet RecordSet} формата {@link ITabsSourceResult ITabsSourceResult}.
 * @property {Object} [templateOptions] Опции, передаваемые в разметку для контентной области вкладки.
 */
export interface ITabOptions {
    style: string;
    source?: SbisService | Memory;
    templateOptions?: object;
}

export interface ITabsOptions {
    [key: number]: ITabOptions;
}

export interface IColoredTabsGridOptions extends IControlOptions {
    /**
     * @name Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid#itemTemplate
     * @cfg {TemplateFunction} Содержит разметку для контентной области вкладки.
     */
    itemTemplate: TemplateFunction;

    /**
     * @name Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid#headTemplate
     * @cfg {TemplateFunction} Содержит разметку для заголовка вкладки.
     * @default undefined
     * @remark
     * Опция не обязательна к заполнению.
     */
    headTemplate?: TemplateFunction;

    /**
     * @name Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid#tabsOptions
     * @cfg {Object.<ITabOptions>} Опции для шаблона цветной вкладки.
     */
    tabsOptions: ITabsOptions;

    /**
     * @name Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid#tabsOptions
     * @cdf {Number} Ключ развернутой цветной вкладки.
     * @default null.
     * @example
     * Для разворота всех вкладок в исходное состояние необходимо забиндить опцию и сбрасывать ее на null:
     * <pre class="brush:html">
     *     <Controls-TabsLayout.coloredGrid:View bind:tabSelectedKey="_tabSelectedKey" />
     *     <Controls.buttons:Button
     *         tooltip="Развернуть все вкладки"
     *         on:click="_distributeClickHandler()"
     *     />
     * </pre>
     * <pre class="brush:js">
     *     ...
     *     this._tabSelectedKey = null;
     *
     *     _distributeClickHandler = function() {
     *         this._tabSelectedKey = null;
     *     }
     *     ...
     * </pre>
     */
    tabSelectedKey: number;

    /**
     * @name Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid#backgroundFill
     * @cfg {String} Позволяет установить расположение фона на вкладках.
     * @variant full Фон на заголовках и на контентной области вкладок.
     * @variant header Фон только на заголовках вкладок.
     * @default full
     */
    backgroundFill?: string;

    /**
     * @name Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid#headerContentTemplate
     * @cfg {Content|String} Контент, располагающийся слева от вкладок.
     */
    headerContentTemplate?: TemplateFunction | string;
    _dataOptionsValue: IContextOptionsValue;
}

/**
 * @typedef {Types/collection:RecordSet} ITabsSourceResult
 * @description Требуемый формат результата, возвращаемого источником данных.
 * @property {Number} id Уникальный ключ, идентифицирующий вкладку.
 * @property {String} name Заголовок вкладки.
 * @property {Types/collection:RecordSet} items Набор записей для табличного представления вкладки.
 * @property {Number} total Количество записей на вкладке.
 */

interface IColorItems extends IItemTab {
    templateOptions: {
        source: PrefetchProxy;
        selectedKeys: TKeysSelection;
        excludedKeys: TKeysSelection;
        itemsReadyCallback: Function;
    };
    headTemplateOptions: {
        title: string;
        count: number;
    };
}

interface IDataOptions {
    items: RecordSet;
    source: SbisService | Memory;
}

interface ISelectedKeysByTabs {
    [key: string]: TKeysSelection;
}

interface IExcludedKeysByTabs {
    [key: string]: TKeysSelection;
}

interface ISelectedKeyCountByTabs {
    count: number;
    selectedAll: boolean;
}

interface ISelectedKeysCountByTabs {
    [key: string]: ISelectedKeyCountByTabs;
}

/**
 * Табличная обертка над {@link https://wi.sbis.ru/docs/js/ColoredTabs/ColoredTabs/ ColoredTabs/ColoredTabs}
 * @remark
 * Предназначена для упрощения взаимодействия с ColoredTabs/ColoredTabs в раскладках списка и его окружения:
 * 1. {@link https://wi.sbis.ru/docs/js/ColoredTabs/browsers/Browser/ ColoredTabs/browsers/Browser}.
 * 2. {@link https://wi.sbis.ru/docs/js/ColoredTabs/Selector/Browser/ ColoredTabs/Selector/Browser}.
 *
 *
 * @class Controls-TabsLayout/_coloredGrid/ColoredTabsGrid
 * @extends UI/Base:Control
 * @control
 * @public
 * @mixes Controls-TabsLayout/_coloredGrid/ColoredTabsGrid:IColoredTabsGrid
 * @demo Controls-TabsLayout-demo/colored/GridView/Index
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/ColoredTabsGrid#listSelectedKeysChanged Происходит при изменении выбранных записей.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} keys Набор ключей выбранных элементов всех вкладок.
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/ColoredTabsGrid#excludedKeysChanged Происходит при изменении исключенных
 * из выбора записей.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} keys Набор ключей выбранных элементов всех вкладок.
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/ColoredTabsGrid#itemsLinksChanged Происходит когда экземпляр данных получен из
 * источника и подготовлен к дальнейшей обработке контролом.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Types/collection:RecordSet>} items Набор ссылок на экземпляры данных списков вкладок.
 * @example
 * В качестве примера используем функцию для сохранения ссылки на items,
 * чтобы иметь возможность изменять данные в дальнейшем.
 * <pre class="brush:html">
 *     <Controls-TabsLayout.coloredGrid:View on:itemsLinksChanged="_itemsLinksChangedHandler()" />
 * </pre>
 * <pre class="brush:js">
 *     _itemsLinksChangedHandler = function(event, items) {
 *         this._itemsLinks = items;
 *     }
 * </pre>
 * <pre class="brush:js">
 *     _updateItemField = function(itemId, field, value) {
 *         this._itemsLinks.forEach((rs) => {
 *             const rec = rs.getRecordById(itemId);
 *             if (rec) {
 *                 rec.set(field, value);
 *             }
 *         });
 *     }
 * </pre>
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/ColoredTabsGrid#tabSelectedKeyChanged Происходит при изменении текущей
 * развернутой вкладки.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} tabSelectedKey Ключ текущей развернутой вкладки.
 */

export default class ColoredTabsGrid extends Control<IColoredTabsGridOptions> {
    protected _template: TemplateFunction = template;
    protected _tabSelectedKey: number = null;
    private _colorItems: IColorItems[] = [];
    private _listItems: RecordSet[] = [];
    private _dataOptions: IDataOptions;
    private _listSelectedKeys: TKeysSelection = [];
    private _listExcludedKeys: TKeysSelection = [];
    private _selectedKeysByTabs: ISelectedKeysByTabs = {};
    private _excludedKeysByTabs: IExcludedKeysByTabs = {};
    private _selectedKeysCountByTabs: ISelectedKeysCountByTabs = {};

    protected _beforeMount(options: IColoredTabsGridOptions): void {
        this._onCollectionChanged = this._onCollectionChanged.bind(this);
        this._dataOptions = { ...options._dataOptionsValue } as IDataOptions;
        this._subscribeOnItemsChanged();
    }

    protected _afterMount(options: IColoredTabsGridOptions): void {
        this._buildTabs();
    }

    protected _beforeUpdate(options: IColoredTabsGridOptions): void {
        this._dataOptions = { ...options._dataOptionsValue } as IDataOptions;

        if (options._dataOptionsValue.items !== this._options._dataOptionsValue.items) {
            this._options._dataOptionsValue.items.unsubscribe(
                'onCollectionChange',
                this._onCollectionChanged
            );
            this._subscribeOnItemsChanged();
            this._buildTabs();
        } else {
            this._children.ColoredTabs.updateSizes();
        }

        if (options.tabSelectedKey !== this._tabSelectedKey) {
            this._tabSelectedKey = options.tabSelectedKey;
        }
    }

    /**
     * Подписаться на событие об изменении набора записей.
     * @private
     */
    private _subscribeOnItemsChanged(): void {
        this._dataOptions.items.subscribe('onCollectionChange', this._onCollectionChanged);
    }

    /**
     * Конфигурирование набора вкладок с последующей отрисовкой.
     * @private
     */
    private _buildTabs(options?: IColoredTabsGridOptions): void {
        const opts = options || this._options;
        this._listItems = [];
        this._colorItems = [];

        this._dataOptions.items.each((rec: Model) => {
            let itemsData = rec.get('items');
            const tabName = rec.get('name');
            const tabCount = rec.get('total');
            const keyValue = rec.get('id');

            itemsData = new RecordSet({
                rawData: itemsData.getRawData(),
                adapter: itemsData.getAdapter(),
                model: this._dataOptions.source.getModel(),
            });

            const tabOpts = opts.tabsOptions[keyValue];
            const dataSource = new PrefetchProxy({
                data: { query: itemsData },
                target: tabOpts.source || this._dataOptions.source,
            });

            if (this._selectedKeysByTabs[tabName]) {
                this._moveSelectedKeyIfItemMovedToAnotherTab(tabName, itemsData);
            }
            this._colorItems.push({
                // выпилить после: https://online.sbis.ru/opendoc.html?guid=fba9fc3e-82c5-4d3e-9cf2-a2bd7392d0ef
                key: randomId('colored-tab-'),
                title: opts.headTemplate ? tabName : `${tabName} ${tabCount}`,
                backgroundStyle: tabOpts.style,
                itemTemplate: opts.itemTemplate,
                headTemplate: opts.headTemplate,
                templateOptions: {
                    source: dataSource,
                    selectedKeys: this._selectedKeysByTabs[tabName] || [],
                    excludedKeys: this._excludedKeysByTabs[tabName] || [],
                    itemsReadyCallback: this._itemsReadyCallback.bind(this),
                    ...(tabOpts.templateOptions || {}),
                },
                headTemplateOptions: {
                    title: tabName,
                    count: tabCount,
                },
            });
        });

        // Костыль до решения по задаче https://online.sbis.ru/opendoc.html?guid=fba9fc3e-82c5-4d3e-9cf2-a2bd7392d0ef
        this._notify('colorTabsItemsReady', [this._colorItems]);
    }

    /**
     * Обработчик события об изменении коллекции.
     * @remark
     * Покрывает такие кейсы, КАК, например, ввод строки поискс
     * Layout/browser, в котором будет лежать этот компонент.
     * @private
     */
    private _onCollectionChanged(): void {
        this._buildTabs();
    }

    /**
     * Обновить набор ключей записей.
     * @param {Array.<Number|String>} listForUpdate Список ключей, который обновляем.
     * @param {Array.<Number|String>} changedIds Набор ключей к обработке.
     * @param {Boolean} insert Нужно пополнить набор ключей.
     * @private
     */
    private _updateKeys(
        listForUpdate: TKeysSelection,
        changedIds: TKeysSelection,
        insert: boolean
    ): void {
        changedIds.forEach((key: TKeySelection) => {
            const index: number = listForUpdate.indexOf(key);
            if (index === -1 && insert) {
                listForUpdate.push(key);
            } else if (index !== -1 && !insert) {
                listForUpdate.splice(index, 1);
            }
        });
    }

    /**
     * Обработчик события при изменении набора выбранных элементов списка.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {Array.<Number|String>} values Массив ключей выбранных элементов.
     * @param {Array.<Number|String>} added Массив ключей, добавленных в selectedKeys.
     * @param {Array.<Number|String>} deleted Массив ключей, удаленных из selectedKeys.
     * @param {String} tabName Имя вкладки, чье событие.
     * @private
     */
    protected _selectedKeysTabChangedHandler(
        event: SyntheticEvent,
        values: TKeysSelection,
        added: TKeysSelection,
        deleted: TKeysSelection,
        tabName: string
    ): void {
        // eslint-disable-line
        event.stopPropagation();

        // добавляем added и удаляем deleted
        this._selectedKeysByTabs[tabName] = values.slice();
        if (added.length && added[0]) {
            this._updateKeys(this._listSelectedKeys, added, true);
        }
        if (deleted.length && deleted[0]) {
            this._updateKeys(this._listSelectedKeys, deleted, false);
        }
        if (added.length && added[0] === null) {
            this._listSelectedKeys = [null];
        }

        if (deleted.length) {
            if (deleted[0] === null) {
                if (
                    !this._hasKeyInAnotherLists(null, this._selectedKeysByTabs, tabName) &&
                    !added.length
                ) {
                    this._listSelectedKeys = [];
                }
            } else {
                this._updateKeys(this._listSelectedKeys, deleted, false);
            }
        }
        this._notify('listSelectedKeysChanged', [this._listSelectedKeys], {
            bubbling: true,
        });
    }

    /**
     * Обработчик события при изменении набора исключенных из выбора элементов списка.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {Array.<Number|String>} values Массив ключей выбранных элементов.
     * @param {Array.<Number|String>} added Массив ключей, добавленных в selectedKeys.
     * @param {Array.<Number|String>} deleted Массив ключей, удаленных из selectedKeys.
     * @param {String} tabName Имя вкладки, чье событие.
     * @private
     */
    protected _excludedKeysTabChangedHandler(
        event: SyntheticEvent,
        values: TKeysSelection,
        added: TKeysSelection,
        deleted: TKeysSelection,
        tabName: string
    ): void {
        let addedExcludedKeys = added;
        let deletedExcludedKeys = deleted;

        event.stopPropagation();

        if (!values.length && deleted[0] === null) {
            deletedExcludedKeys = [];
            addedExcludedKeys = [];
            const tabItems = this._options.items
                .at(this._options.items.getIndexByValue('name', tabName))
                .get('items');
            tabItems.each((item) => {
                addedExcludedKeys.push(item.getKey());
            });
            this._excludedKeysByTabs[tabName] = addedExcludedKeys.slice();
        } else {
            this._excludedKeysByTabs[tabName] = values.slice();
        }

        if (addedExcludedKeys.length) {
            this._updateKeys(this._listExcludedKeys, addedExcludedKeys, true);
        }
        if (deletedExcludedKeys.length) {
            if (deletedExcludedKeys[0] === null) {
                if (!this._hasKeyInAnotherLists(null, this._excludedKeysByTabs, tabName)) {
                    this._listExcludedKeys = [];
                }
            } else {
                this._updateKeys(this._listExcludedKeys, deletedExcludedKeys, false);
            }
        }
        this._notify('excludedKeysChanged', [this._listExcludedKeys], {
            bubbling: true,
        });
    }

    /**
     * Считаем корректное количество выбранного и состояние чекбокса мультивыбора по всем спискам.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {Number} count Количество выбранных записей.
     * Если не удается посчитать (например, потомков узла), придет null.
     * @param {Boolean} selectedAll Выбраны ли все записи.
     * @param {String} tabName Имя цветной вкладки, с которой пришло событие.
     * @private
     */
    protected _listSelectedKeysCountTabChangedHandler(
        event: SyntheticEvent,
        count: number | null,
        selectedAll: boolean,
        tabName: string
    ): void {
        // eslint-disable-line
        event.stopPropagation();

        this._selectedKeysCountByTabs[tabName] = { count, selectedAll };
        let isSelectedAll = true;
        let selectedCount = 0;
        for (const index in this._selectedKeysCountByTabs) {
            if (this._selectedKeysCountByTabs.hasOwnProperty(index)) {
                const item = this._selectedKeysCountByTabs[index];
                if (!item.selectedAll) {
                    isSelectedAll = false;
                }
                if (typeof item.count === 'number' && selectedCount !== null) {
                    selectedCount += item.count;
                } else {
                    selectedCount = null;
                }
            }
        }
        this._notify('listSelectedKeysCountChanged', [selectedCount, isSelectedAll], {
            bubbling: true,
        });
    }

    /**
     * Сохраним себе набор записей, чтобы потом с ним работать.
     * @param {Types/collection:RecordSet} items Загруженные данные.
     * @param {boolean} [nodeLoad] Загружен узел.
     * @private
     */
    private _itemsReadyCallback(items: RecordSet, nodeLoad?: boolean): void {
        if (items) {
            // если подгрузка при открытии узла - добавляем в массив новый набор данных списка
            if (!nodeLoad) {
                this._listItems.push(items);
            }
            this._notify('itemsLinksChanged', [this._listItems]);
        }
    }

    /**
     * Обработчик изменения ключа развернутой вкладки.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {Number} tabSelectedKey Ключ развернутой вкладки.
     * @protected
     */
    protected _tabSelectedKeyChangedHandler(event: SyntheticEvent, tabSelectedKey: number): void {
        this._tabSelectedKey = tabSelectedKey;
        this._notify('tabSelectedKeyChanged', [tabSelectedKey]);
    }

    private _hasKeyInAnotherLists(
        key: TKey,
        keys: IExcludedKeysByTabs | ISelectedKeysByTabs,
        tabName: string
    ): boolean {
        return !!Object.keys(keys).find((listName) => {
            return tabName !== listName && keys[listName].includes(key);
        });
    }

    private _moveSelectedKeyIfItemMovedToAnotherTab(
        tabName: string,
        itemsInTab: RecordSet
    ): boolean {
        itemsInTab.each((item) => {
            const itemKey = item.getKey();
            Object.entries(this._selectedKeysByTabs).forEach(([name, selectedKeys]) => {
                if (name !== tabName) {
                    const selectedKeyIndex = selectedKeys.indexOf(item.getKey());
                    const isSelectedKeyMovedToAnotherTab = selectedKeyIndex !== -1;

                    if (isSelectedKeyMovedToAnotherTab) {
                        this._selectedKeysByTabs[tabName] = [
                            ...(this._selectedKeysByTabs[tabName] || []),
                        ];
                        this._selectedKeysByTabs[tabName].push(itemKey);

                        this._selectedKeysByTabs[name] = [
                            ...(this._selectedKeysByTabs[name] || []),
                        ];
                        this._selectedKeysByTabs[name].splice(selectedKeyIndex, 1);
                    }
                }
            });
        });
    }
}
