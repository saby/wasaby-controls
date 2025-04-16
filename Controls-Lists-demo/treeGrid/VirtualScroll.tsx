import * as React from 'react';
import { Component } from 'Controls-Lists/treeGrid';
import { Memory } from 'Types/source';
import { Container as ScrollContainer } from 'Controls/scroll';
import 'css!Controls-Lists-demo/treeGrid/ActualDevelopmentState';

const STORE_ID = 'grid_virtual_scroll';
const KEY_PROPERTY = 'key';
const PARENT_PROPERTY = 'parent';
const NODE_PROPERTY = 'nodeType';
const DATA_COUNT = 1000;
const virtualScrollConfig = {
    pageSize: 100,
};

const VirtualScroll = React.memo(
    React.forwardRef(function VirtualScroll(
        _props: {},
        ref: React.ForwardedRef<HTMLDivElement>
    ): JSX.Element {
        return (
            <div ref={ref} className="controls-padding-m">
                <ScrollContainer className="ControlsListsDemo-maxHeight-500">
                    <Component storeId={STORE_ID} virtualScrollConfig={virtualScrollConfig} />
                </ScrollContainer>
            </div>
        );
    })
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
VirtualScroll.getLoadConfig = () => ({
    [STORE_ID]: {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: {
            collectionType: 'TreeGrid',
            source: SOURCE,
            columns: COLUMNS,
            navigation: NAVIGATION,
            parentProperty: PARENT_PROPERTY,
            nodeProperty: NODE_PROPERTY,
        },
    },
});

const NAVIGATION = {
    source: 'page',
    sourceConfig: {
        pageSize: 1000,
        hasMore: false,
    },
    viewConfig: {
        pagingMode: 'basic',
    },
    view: 'infinity',
};

const SOURCE = new Memory({
    data: [...Array(DATA_COUNT)].map((_, index) => ({
        [KEY_PROPERTY]: index,
        [PARENT_PROPERTY]: null,
        [NODE_PROPERTY]: null,
        title: 'Запись #' + index,
    })),
    keyProperty: KEY_PROPERTY,
});

const COLUMNS = [
    {
        key: 'title',
        displayProperty: 'title',
    },
];

export default VirtualScroll;
