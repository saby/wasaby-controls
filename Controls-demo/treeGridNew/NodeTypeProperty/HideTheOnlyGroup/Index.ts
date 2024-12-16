import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { TColspanCallbackResult } from 'Controls/grid';
import { IGroupNodeColumn } from 'Controls/treeGrid';
import ExpandedSource from '../../DemoHelpers/ExpandedSource';

import { data } from '../data/NodeTypePropertyData';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/HideTheOnlyGroup/HideTheOnlyGroup';
import * as PriceColumnTemplate from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/PriceColumnTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return data.slice(0, 4);
}

const columns: IGroupNodeColumn[] = [
    {
        displayProperty: 'title',
        width: '300px',
        groupNodeConfig: {
            textAlign: 'center',
        },
    },
    {
        displayProperty: 'count',
        width: '100px',
        align: 'right',
    },
    {
        displayProperty: 'price',
        width: '100px',
        align: 'right',
        template: PriceColumnTemplate,
    },
];

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IGroupNodeColumn[] = columns;

    protected _colspanCallback(
        item: Model,
        column: IGroupNodeColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        if (typeof item === 'string' || item.get('nodeType') === 'group') {
            return 'end';
        }
        return 1;
    }

    protected _reloadWithTwoGroups(): void {
        const slice = this._options._dataOptionsValue.NodeTypePropertyHideTheOnlyGroup;
        slice.setState({
            source: new ExpandedSource({
                keyProperty: 'key',
                parentProperty: 'parent',
                data: data.slice(0, 7),
            }),
            expandedItems: [1, 2],
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyHideTheOnlyGroup: {
                dataFactoryName:
                    'Controls-demo/treeGridNew/NodeTypeProperty/HideTheOnlyGroup/CustomFactory',
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
                    expandedItems: [1],
                    nodeTypeProperty: 'nodeType',
                },
            },
        };
    },
});
