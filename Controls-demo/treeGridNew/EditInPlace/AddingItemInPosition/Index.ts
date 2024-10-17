import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/AddingItemInPosition/AddingItemInPosition';
import { createGroupingSource } from 'Controls-demo/treeGridNew/Grouping/Source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _targetItemName: string = '';
    private _fakeKey: number = 123412;

    _beginAdd(e: Event, addPosition: 'top' | 'bottom'): void {
        const targetKey =
            this._targetItemName === 'null' || this._targetItemName === ''
                ? null
                : this._targetItemName.replace('item', 'key');
        const targetItem =
            targetKey === null
                ? undefined
                : this._children.treeGrid.getItems().getRecordById(targetKey);
        const parentKey = targetItem ? targetItem.get('parent') : null;
        const group = targetItem ? targetItem.get('group') : 'group_1';

        this._children.treeGrid.beginAdd({
            item: this._createItem(parentKey, group),
            targetItem,
            addPosition,
        });
    }

    private _createItem(parent: Model, group: Model): Model {
        return new Model({
            keyProperty: 'key',
            rawData: {
                key: `${++this._fakeKey}`,
                title: '',
                count: 0,
                group,
                hasChildren: false,
                parent,
                type: null,
            },
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceAddingItemInPosition: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: createGroupingSource({
                        count: 20,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            limit: 20,
                            field: 'key',
                            position: 'key_0',
                            direction: 'forward',
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    hasChildrenProperty: 'hasChildren',
                    expanderVisibility: 'hasChildren',
                },
            },
        };
    }
}
