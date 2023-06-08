import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory, HierarchicalMemory } from 'Types/source';
import { GridCollection, IColumn } from 'Controls/grid';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';
import { debounce } from 'Types/function';

import template = require('wml!Controls-demo/treeGridNew/VirtualScroll/RenderRedrawCount/RenderRedrawCount');
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/VirtualScroll/RenderRedrawCount/ColumnTemplate';

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

    protected _gridViewSource: Memory;
    protected _treeGridViewSource: HierarchicalMemory;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;
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

    private _nextKey: number = 0;

    protected _counters: {
        gridView: IRedrawCounter[];
        treeGridView: IRedrawCounter[];
    } = {
        gridView: [],
        treeGridView: [],
    };

    private _debouncedRedrawCounters: Function;

    protected _beforeMount(): void {
        const data = this._generateListItems(LIST_ITEMS_COUNT);
        this._gridViewSource = new Memory({
            keyProperty: 'key',
            data,
        });
        this._treeGridViewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data,
            filter: () => {
                return true;
            },
        });
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                page: 0,
                pageSize: 60,
                hasMore: false,
            },
        };
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

    private _generateListItems(count: number): IListItem[] {
        const result = [];
        while (count--) {
            result.push(this._generateListItem());
        }
        return result;
    }

    private _generateListItem(): IListItem {
        const key = this._nextKey++;
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
}
