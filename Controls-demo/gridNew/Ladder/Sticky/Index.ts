import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { Record } from 'Types/entity';
import type { View as Grid } from 'Controls/grid';

import 'css!DemoStand/Controls-demo';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/Sticky/Sticky';
import * as ResultsTpl from 'wml!Controls-demo/gridNew/Ladder/Sticky/ResultsCell';

import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderTasksPhoto';
import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderTasksDescription';
import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderTasksReceived';

import { ListItems } from 'Controls/dragnDrop';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IStickyLadderColumn {
    template: string;
    width: string;
    stickyProperty?: string;
    resultTemplate?: TemplateFunction;
}

interface IStickyLadderHeader {
    title?: string;
}

const { getData } = Tasks;

/**
 * Для документации https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/#sticky
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IStickyLadderColumn[] = Tasks.getColumns();
    protected _ladderProperties: string[] = ['photo', 'date'];
    protected _selectedKeys: number[] = [];
    protected _header: IStickyLadderHeader[] = [{}, { title: 'description' }, { title: 'state' }];
    protected _children: {
        grid: Grid;
    };

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        // eslint-disable-next-line
        this._columns[0].stickyProperty = 'photo';
        // eslint-disable-next-line
        this._columns[1].resultTemplate = ResultsTpl;
        // eslint-disable-next-line
        this._columns[2].stickyProperty = 'date';
    }

    protected _dragStart(_: SyntheticEvent, items: string[]): unknown {
        return new ListItems({
            items,
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Record>,
        target: number,
        position: number
    ): void {
        this._children.grid.moveItems(
            {
                selected: entity.getItems(),
                excluded: [],
            },
            target,
            position
        );
    }

    protected _beginAdd(): void {
        this._children.grid.beginAdd();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
