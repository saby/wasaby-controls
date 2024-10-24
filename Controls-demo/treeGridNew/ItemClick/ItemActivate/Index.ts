import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemClick/ItemActivate/ItemActivate';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown[] = Flat.getColumns();

    protected _expandByItemClick: boolean = false;

    protected _clickedItem: string;
    protected _activeItem: string;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemClickItemActivate: {
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
                },
            },
        };
    }

    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        this._clickedItem = item ? `"key: ${item.getKey()}"` : null;
    }

    protected _onItemActivate(e: SyntheticEvent, item: Model, nativeEvent: SyntheticEvent): void {
        this._activeItem = item ? `"key: ${item.getKey()}"` : null;
    }

    protected _toggleExpandByItemClick(): void {
        this._expandByItemClick = !this._expandByItemClick;
    }
}
