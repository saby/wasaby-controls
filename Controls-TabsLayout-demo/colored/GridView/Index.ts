import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-TabsLayout-demo/colored/GridView/Template');
import { default as ColoredTabTmpl } from './ColoredTabTmpl/ColoredTab';
import { Data } from 'Controls-TabsLayout-demo/colored/GridView/resources/Data';
import { query } from 'Application/Env';
import { View } from 'Controls-TabsLayout/colored';

interface ISourceFilter {
    searchString: string;
    filter: string;
}

export default class ContainerBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _tabSelectedKey: number = null;
    protected _coloredTabTmpl: typeof ColoredTabTmpl;
    protected _source: Memory;
    protected _tabsOptions: object;
    protected _allSelectedKeys: string[];
    protected _allExcludedKeys: string[];
    protected _filterSource: object;
    protected _filter: ISourceFilter;
    protected _itemsForSelect: string[];
    private _oldFilter: ISourceFilter;

    protected _beforeMount(): void {
        this._coloredTabTmpl = ColoredTabTmpl;
        this._allSelectedKeys = [];
        this._allExcludedKeys = [];

        this._updateSource();

        this._filterSource = [
            {
                emptyText: 'Все',
                emptyKey: null,
                name: 'filter',
                viewMode: 'frequent',
                textValue: '',
                value: null,
                resetValue: null,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 'Сделать', title: 'Сделать' },
                            { id: 'На проверке', title: 'На проверке' },
                            { id: 'Выполнено', title: 'Выполнено' },
                            { id: 'Удаленные', title: 'Удаленные' },
                        ],
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                },
            },
        ];

        this._tabsOptions = {
            1: {
                style: 'label',
                templateOptions: {
                    tabName: 'Сделать',
                    multiSelectVisibility: true,
                },
            },
            2: {
                style: 'link',
                templateOptions: {
                    tabName: 'На проверке',
                    multiSelectVisibility: true,
                },
            },
            3: {
                style: 'success',
                templateOptions: {
                    tabName: 'Выполнено',
                    multiSelectVisibility: true,
                },
            },
            4: {
                style: 'primary',
                templateOptions: {
                    tabName: 'Удаленные',
                    multiSelectVisibility: true,
                },
            },
        };
    }

    protected _afterMount(): void {
        if (query.get.animation === 'false') {
            View._offAnimation();
        }
    }

    /**
     * Сбросить активную цветную вкладку (распределить вкладки равномерно).
     * @protected
     */
    protected _distributeClickHandler(): void {
        this._tabSelectedKey = null;
    }

    /**
     * Изменение набора выбранных отправок в цветных вкладках.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {Array<String>} values Новый набор ключей выбранных отправок.
     * @protected
     */
    protected _allSelectedKeysChangedHandler(event: SyntheticEvent, values: string[]): void {
        this._allSelectedKeys = values.slice();
    }

    /**
     * Изменение набора исключенных из выбора отправок в цветных вкладках.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {Array<String>} values Новый набор ключей исключенных из выбора отправок.
     * @protected
     */
    protected _allExcludedKeysChangedHandler(event: SyntheticEvent, values: string[]): void {
        this._allExcludedKeys = values.slice();
    }

    /**
     * Обработчик готовности записей списка.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {RecordSet} items Набор цветных цветных вкладок.
     * @protected
     */
    protected _itemsReadyHandler(event: SyntheticEvent, items: RecordSet): void {
        const itemsForSelect = [];
        items.each((tab) => {
            tab.get('items').each((item) => {
                if (item.has('text') && item.get('text')) {
                    itemsForSelect.push(item.get('text'));
                }
            });
        });
        this._itemsForSelect = itemsForSelect.slice();
    }

    /**
     * Обработчик изменения фильтра у браузера.
     * @param {SyntheticEvent} event Дескриптор события.
     * @param {ISourceFilter} newFilter Новый фильтр источника.
     * @private
     */
    protected _filterChangedHandler(event: SyntheticEvent, newFilter: ISourceFilter): void {
        if (this._filter !== this._oldFilter) {
            const oldSearch = (this._oldFilter && this._oldFilter.searchString) || '';
            const newSearch = this._filter.searchString || '';
            if (oldSearch === newSearch) {
                this._updateSource();
            }
            this._oldFilter = this._filter;
        }
    }

    /**
     * Обновим источник для срабатывания фильтрации.
     * @private
     */
    private _updateSource(): void {
        this._source = new Memory({
            data: Data,
            keyProperty: 'id',
            filter: (item, where) => {
                const searchField = 'searchString';
                if (where.hasOwnProperty('searchString') && where[searchField]) {
                    return (
                        item.get('name').toLowerCase().indexOf(where[searchField].toLowerCase()) !==
                        -1
                    );
                }

                const filterField = 'filter';
                if (where.hasOwnProperty(filterField) && where[filterField]) {
                    return (
                        item.get('name').toLowerCase().indexOf(where[filterField].toLowerCase()) !==
                        -1
                    );
                }

                return true;
            },
        });
    }

    static _styles: string[] = ['Controls-TabsLayout-demo/colored/GridView/Style'];
}
