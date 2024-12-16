import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/DragNDrop/DragNDrop';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TItemsReadyCallback } from 'Controls-demo/types';
import { DnD } from 'Controls-demo/gridNew/DemoHelpers/Data/DnD';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext } from 'Controls/context';

const MULTISELECT_VISIBLE_VALUES = ['hidden', 'visible', 'onhover'];

const { getData } = DnD;

class Demo extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemsReadyCallback: TItemsReadyCallback = this._itemsReady.bind(this);
    protected _columns: IColumn[] = DnD.getColumns();
    private _multiselectVisibleValueIndex: number = 0;
    private _itemsFirst: RecordSet = null;

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): ItemsEntity {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new ItemsEntity({
            items,
            title: firstItem.get('title'),
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
                excluded: [],
            },
            targetKey,
            position
        );
    }

    protected _onToggle(): void {
        this._multiselectVisibleValueIndex++;
        if (this._multiselectVisibleValueIndex >= MULTISELECT_VISIBLE_VALUES.length) {
            this._multiselectVisibleValueIndex = 0;
        }
        this._options._dataOptionsValue.DragNDrop.setState({
            multiSelectVisibility: MULTISELECT_VISIBLE_VALUES[this._multiselectVisibleValueIndex],
        });
    }
}

const ConnectedDemo = connectToDataContext(Demo);
ConnectedDemo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        DragNDrop: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                multiSelectVisibility: 'hidden',
            },
        },
    };
};
export default ConnectedDemo;
