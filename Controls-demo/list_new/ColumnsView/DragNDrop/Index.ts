import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'UI/Vdom';
import * as Dnd from 'Controls/dragnDrop';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/list_new/ColumnsView/DragNDrop/Template');

const NUMBER_OF_ITEMS = 200;

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с key="${item.key}". `;
        },
    });
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _dragStart(_: SyntheticEvent, items: number[]): Dnd.ItemsEntity {
        return new Dnd.ItemsEntity({
            items,
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        const targetKey = target?.getKey ? target.getKey() : target;
        return this._children.list.moveItems(
            {
                selected: entity.getItems(),
                excluded: [],
            },
            targetKey,
            position
        );
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewDragNDrop: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'visible',
                },
            },
        };
    }
}
