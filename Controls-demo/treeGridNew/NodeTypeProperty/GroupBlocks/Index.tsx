import * as React from 'react';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { View } from 'Controls/treeGrid';
import { TColspanCallbackResult, ItemTemplate as GridItemTemplate } from 'Controls/grid';
import { extendedData } from 'Controls-demo/treeGridNew/NodeTypeProperty/data/NodeTypePropertyData';
import * as PriceColumnTemplate from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/resources/PriceColumnTemplate';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { Container } from 'Controls/scroll';
import { Model } from 'Types/entity';
import { IGroupNodeColumn } from 'Controls/treeGrid';
import { useContent } from 'UICore/Jsx';

function getData() {
    return extendedData;
}

export const columns: IGroupNodeColumn[] = [
    {
        width: '300px',
        displayProperty: 'title',
        groupNodeConfig: {
            textAlign: 'center',
        },
    },
    {
        width: '100px',
        displayProperty: 'count',
        align: 'right',
    },
    {
        width: '100px',
        displayProperty: 'price',
        align: 'right',
        template: PriceColumnTemplate,
    },
    {
        width: '100px',
        displayProperty: 'price1',
        align: 'right',
        template: PriceColumnTemplate,
    },
    {
        width: '100px',
        displayProperty: 'price2',
        align: 'right',
        template: PriceColumnTemplate,
    },
    {
        width: '50px',
        displayProperty: 'tax',
        align: 'right',
    },
    {
        width: '100px',
        displayProperty: 'price3',
        align: 'right',
        template: PriceColumnTemplate,
        fontSize: 's',
    },
];

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
    const itemTemplate = useContent((itemTemplateProps: object) => {
        const isGroupNode = itemTemplateProps.item.contents.get('nodeType') === 'group';
        return (
            <GridItemTemplate {...itemTemplateProps} cursor={isGroupNode ? 'default' : 'pointer'} />
        );
    }, []);
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
                    itemTemplate={itemTemplate}
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
