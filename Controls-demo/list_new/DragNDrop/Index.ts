import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ISelectionObject } from 'Controls/interface';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import * as Dnd from 'Controls/dragnDrop';

import * as Template from 'wml!Controls-demo/list_new/DragNDrop/DragNDrop';

const MOVE_DELAY = 1000;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _itemsReadyCallback: (items: RecordSet) => void = this._itemsReady.bind(this);

    private _itemsFirst: RecordSet;
    private _multiselectVisibility: 'visible' | 'hidden' = 'hidden';
    private _slowMoveMethod: boolean;

    protected _dragStart(_: SyntheticEvent, items: number[]): void {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items,
            title: firstItem.get('title'),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Dnd.ItemsEntity,
        target: Model,
        position: string
    ): void | Promise<void> {
        const selection: ISelectionObject = {
            selected: entity.getItems(),
            excluded: [],
        };
        if (this._slowMoveMethod) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this._children.list.moveItems(selection, target.getKey(), position);
                    resolve();
                }, MOVE_DELAY);
            });
        } else {
            this._children.list.moveItems(selection, target.getKey(), position);
        }
    }

    protected _onToggle(): void {
        this._multiselectVisibility =
            this._multiselectVisibility === 'visible' ? 'hidden' : 'visible';
        this._options._dataOptionsValue.DragNDrop.setState({
            multiSelectVisibility: this._multiselectVisibility,
        });
    }

    protected _onSlowMoveMethod(): void {
        this._slowMoveMethod = !this._slowMoveMethod;
    }

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
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
    },
});
