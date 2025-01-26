import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/OnBeforeItemCollapse/OnBeforeItemCollapse';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Events } from '../DemoHelpers/Data/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../DemoHelpers/ExpandedSource';

function getData() {
    return Events.getDataBeforeCollapsed();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Events.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            OnBeforeItemCollapse: {
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
                    nodeProperty: 'nodeType',
                    expandedItems: [1, 2],
                },
            },
        };
    }

    protected _onBeforeItemCollapse(event: SyntheticEvent, item: Model): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
}
