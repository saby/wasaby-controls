import * as React from 'react';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { View } from 'Controls/treeGrid';
import { TColspanCallbackResult } from 'Controls/grid';
import { columns } from 'Controls-demo/treeGridNew/NodeTypeProperty/Base/Index';
import { extendedData } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { Container } from 'Controls/scroll';
import { Model } from 'Types/entity';
import { IGroupNodeColumn } from 'Controls/treeGrid';

function getData() {
    return extendedData;
}

const itemTemplateOptions = {
    backgroundStyle: 'default',
    backgroundColorStyle: 'default',
    fixedBackgroundStyle: 'unaccented',
};

function colspanCallback(
    item: Model,
    column: IGroupNodeColumn,
    columnIndex: number
): TColspanCallbackResult {
    if (item.get('nodeType') === 'group' && columnIndex === 0) {
        return 3;
    }
    return 1;
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <Container className={'controlsDemo_fixedWidth1000 controlsDemo__height300'}>
                <View
                    className={'controlsDemo__background'}
                    backgroundColorStyle={'transparent'}
                    backgroundStyle={'transparent'}
                    fixedBackgroundStyle={'unaccented'}
                    storeId={'NodeTypePropertyGroupBlocks'}
                    colspanCallback={colspanCallback}
                    groupViewMode={'blocks'}
                    rowSeparatorSize={'s'}
                    columns={columns}
                    itemTemplateOptions={itemTemplateOptions}
                />
            </Container>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeTypePropertyGroupBlocks: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    collapsedItems: [],
                    nodeTypeProperty: 'nodeType',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        useMemoryFilter: true,
                        data: getData(),
                        fetchRecursive: true,
                    }),
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    multiSelectVisibility: 'visible',
                },
            },
        };
    },
});
