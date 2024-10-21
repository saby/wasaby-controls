import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { GridCollection, IColumn } from 'Controls/grid';
import { debounce } from 'Types/function';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/VirtualScroll/RenderRedrawCount/ColumnTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';
import template = require('wml!Controls-demo/treeGridNew/VirtualScroll/RenderRedrawCount/RenderRedrawCount');

interface IRedrawCounter {
    key: CrudEntityKey;
    columnCount: number;
    updated: boolean;
}

interface IListItem {
    key: number;
    title: string;
    description: string;
    parent: string;
    type: boolean;
}

const LIST_ITEMS_COUNT = 180;
const COUNTERS_REQUERY_DELAY = 200;

function generateListItem(key: number): IListItem {
    return {
        key,
        title: `${key} list element`,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ' +
            'ut labore et dolore magna aliqua',
        parent: null,
        type: key < 10 ? true : null,
    };
}

function getData() {
    let nextKey: number = 0;
    let count = LIST_ITEMS_COUNT;
    const result = [];
    while (count--) {
        result.push(generateListItem(nextKey++));
    }
    return result;
}

/**
 * Демка для тестирования кейса, когда при виртуальном скролле пересчитываются и перерисоываются
 * все колонки записей, что в три-четыре раза замедляет скролл.
 * Счётчики справа от списка показывают, сколько раз была отрисована первая колонка в записи при подгрузке
 * очередной пачки.
 * См доброски
 * https://online.sbis.ru/opendoc.html?guid=6b971d6f-db51-4cbe-95d7-a2f5ca8d91a9
 * https://online.sbis.ru/opendoc.html?guid=ea03475c-cb4b-4575-89c5-a00534c34f83.
 * примечание. Нельзя сделать одновременно и счётчик обновления записи и счётчик обновления колонки,
 * т.к. при вызове счётчика обновления записи перерисовываются колонки и подсчёт выходит некорректный.
 */
export default class RenderRedrawDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
            width: '',
            template: ColumnTemplate,
        },
        {
            displayProperty: 'description',
            width: '',
            template: ColumnTemplate,
        },
    ];

    protected _counters: {
        gridView: IRedrawCounter[];
        treeGridView: IRedrawCounter[];
    } = {
        gridView: [],
        treeGridView: [],
    };

    private _debouncedRedrawCounters: Function;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollRenderRedrawCount: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            page: 0,
                            pageSize: 60,
                            hasMore: false,
                        },
                    },
                },
            },
            VirtualScrollRenderRedrawCount1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            page: 0,
                            pageSize: 60,
                            hasMore: false,
                        },
                    },
                    deepReload: true,
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._debouncedRedrawCounters = debounce(this._redrawCounters, COUNTERS_REQUERY_DELAY);
    }

    protected _afterMount(): void {
        this._initCounters('gridView');
        this._initCounters('treeGridView');
    }

    private _initCounters(viewName: string): void {
        const baseControl = this._children[viewName]._children.listControl;
        const model = baseControl.getViewModel() as undefined as GridCollection;
        this._redrawCounters(viewName, model);

        const originalAfterUpdate = baseControl._afterUpdate;
        baseControl._afterUpdate = (...args) => {
            originalAfterUpdate.apply(baseControl, args);
            this._debouncedRedrawCounters(viewName, model);
        };
    }

    private _redrawCounters(viewName: string, model: GridCollection): void {
        const counters = model
            .getItemCounters()
            .map((item, index): IRedrawCounter => {
                const oldColumnCount =
                    this._counters[viewName][index] && this._counters[viewName][index].columnCount;
                const newColumnCount = item.counters.ColumnTemplate;
                return {
                    key: item.key,
                    columnCount: newColumnCount,
                    updated: oldColumnCount !== newColumnCount,
                };
            })
            .filter((item) => {
                return !!item.columnCount;
            });

        if (
            counters.some((c) => {
                return c.updated;
            })
        ) {
            this._counters = {
                gridView: viewName === 'gridView' ? counters : this._counters.gridView,
                treeGridView: viewName === 'treeGridView' ? counters : this._counters.treeGridView,
            };
        }
    }
}
