import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/DragScrolling/DragScrolling';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import * as notScrollableCell from 'wml!Controls-demo/gridNew/ColumnScroll/DragScrolling/notScrollableCell';
import * as notDraggableCell from 'wml!Controls-demo/gridNew/ColumnScroll/DragScrolling/notDraggableCell';
import * as dragScrollPopulationCell from 'wml!Controls-demo/gridNew/ColumnScroll/DragScrolling/populationCell';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

const { getData } = Countries;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _itemsReadyCallback: (items: RecordSet) => void = this._itemsReady.bind(this);
    protected _header: IHeaderCell[] = [
        {
            caption: '#',
            startRow: 1,
            endRow: 3,
            startColumn: 1,
            endColumn: 2,
        },
        {
            caption: 'Географические данные',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 4,
            align: 'center',
        },
        {
            caption: 'Страна',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3,
        },
        {
            caption: 'Столица',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4,
        },
        {
            caption: 'Колонка с выключенным перемещением мышью',
            startRow: 1,
            endRow: 3,
            startColumn: 4,
            endColumn: 5,
        },
        {
            caption: 'Цифры',
            startRow: 1,
            endRow: 2,
            startColumn: 5,
            endColumn: 8,
            align: 'center',
        },
        {
            caption: 'Население',
            startRow: 2,
            endRow: 3,
            startColumn: 5,
            endColumn: 6,
        },
        {
            caption: 'Площадь км2',
            startRow: 2,
            endRow: 3,
            startColumn: 6,
            endColumn: 7,
        },
        {
            caption: 'Плотность населения чел/км2',
            startRow: 2,
            endRow: 3,
            startColumn: 7,
            endColumn: 8,
        },
    ];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '300px',
            template: notDraggableCell,
        },
        {
            displayProperty: 'capital',
            width: 'max-content',
            compatibleWidth: '98px',
        },
        {
            width: '200px',
            template: notScrollableCell,
        },
        {
            displayProperty: 'population',
            width: 'max-content',
            compatibleWidth: '100px',
            template: dragScrollPopulationCell,
        },
        {
            displayProperty: 'square',
            width: 'max-content',
            compatibleWidth: '83px',
        },
        {
            displayProperty: 'populationDensity',
            width: 'max-content',
            compatibleWidth: '175px',
        },
    ];
    protected _itemsDragNDrop: boolean = true;
    protected _dragScrolling: boolean = true;
    protected _itemsFirst: RecordSet;
    protected _dndDelay: number = 250;

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    // eslint-disable-next-line
    protected _dragStart(_: SyntheticEvent, draggedKeys: number[]): ItemsEntity {
        let title = '';

        draggedKeys.forEach((draggedItemKey) => {
            title += this._itemsFirst.getRecordById(draggedItemKey).get('country') + ', ';
        });

        return new ItemsEntity({
            items: draggedKeys,
            // eslint-disable-next-line
            title: title.trim().slice(0, title.length - 2),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        const targetKey = target?.getKey ? target.getKey() : target;
        this._children.grid.moveItems(
            {
                selected: entity.getItems(),
                wxcluded: [],
            },
            targetKey,
            position
        );
    }

    static _styles: string[] = ['Controls-demo/gridNew/ColumnScroll/DragScrolling/DragScrolling'];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScrollDragScrolling: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
