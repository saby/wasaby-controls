import { AddButton } from 'Controls/list';
import { View, NodeFooterTemplate } from 'Controls/treeGrid';
import { Logger } from 'UI/Utils';
import { IColumn } from 'Controls/grid';
import { TreeGridNodeFooterRow } from 'Controls/treeGrid';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { useCallback, forwardRef } from 'react';

const { getData } = Flat;

const columns: IColumn[] = [
    {
        displayProperty: 'title',
    },
];

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth300';
    const addButtonHandler = useCallback((item: TreeGridNodeFooterRow) => {
        const nodeKey = item.getNode().getContents().getKey();
        Logger.info(`Adding started for node ${nodeKey}`);
    }, []);
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="NodeFooterTemplate"
                columns={columns}
                nodeFooterTemplate={(props) => {
                    return (
                        <NodeFooterTemplate
                            {...props}
                            content={() => {
                                return (
                                    <AddButton
                                        caption="Добавить товар"
                                        onClick={() => addButtonHandler(props.item)}
                                    />
                                );
                            }}
                        />
                    );
                }}
            ></View>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        NodeFooterTemplate: {
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
};
