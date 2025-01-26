import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/DragNDropLeafsWithParents/DragNDropLeafsWithParents';
import { HierarchicalMemory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 1,
            title: 'Apple',
            country: 'США',
            rating: '8.5',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 15,
            title: 'Iphones',
            parent: 1,
            rating: '9.2',
            type: true,
            hasChild: true,
        },
        {
            key: 151,
            title: 'iPhone 4s',
            rating: '9.5',
            parent: 15,
            type: null,
        },
        {
            key: 152,
            title: 'iPhone 4',
            rating: '8.9',
            parent: 15,
            type: null,
        },
        {
            key: 153,
            title: 'iPhone X Series',
            rating: '7.6',
            parent: 15,
            type: false,
        },
        {
            key: 1531,
            title: 'iPhone Xs',
            rating: '7.4',
            parent: 153,
            type: null,
        },
        {
            key: 1532,
            title: 'iPhone Xs Max',
            rating: '6.8',
            parent: 153,
            type: null,
        },
        {
            key: 1533,
            title: 'iPhone XR',
            rating: '7.1',
            parent: 153,
            type: null,
        },
        {
            key: 17,
            title: 'Magic Mouse 2',
            modelId: 'MM16',
            rating: '7.2',
            year: '2016',
            parent: 1,
            type: null,
        },
        {
            key: 3,
            title: 'Meizu',
            rating: '7.5',
            country: 'КНР',
            parent: null,
            type: null,
        },
        {
            key: 4,
            title: 'Asus',
            rating: '7.3',
            country: 'Тайвань',
            parent: null,
            type: null,
        },
        {
            key: 5,
            title: 'Acer',
            rating: '7.1',
            country: 'Тайвань',
            parent: null,
            type: null,
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();
    protected _selectedKeys: Number[] = [];

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        const targetKey = target?.getKey?.() || target;
        this._children.view.moveItems(
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
            DragNDropLeafsWithParents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    root: null,
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
