import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/ChangeFooter';
import * as NodeFooter1 from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/NodeFooter1';
import * as NodeFooter2 from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/NodeFooter2';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../../../DemoHelpers/ExpandedSource';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Flat.getColumns();
    protected _nodeFooterTemplate: TemplateFunction = NodeFooter1;

    protected _changeNodeFooter(): void {
        this._nodeFooterTemplate =
            this._nodeFooterTemplate === NodeFooter1 ? NodeFooter2 : NodeFooter1;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterChangeFooter: {
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
                    expandedItems: [null],
                },
            },
        };
    }
}
