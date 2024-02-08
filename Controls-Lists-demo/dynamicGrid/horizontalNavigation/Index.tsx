import * as React from 'react';
import type { IDataConfig } from 'Controls/dataFactory';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import {
    ConnectedComponent,
    IDynamicGridDataFactoryArguments,
    TDynamicColumnMouseEventCallback,
} from 'Controls-Lists/dynamicGrid';

import ExtSource from './source';
import {
    getStaticColumns,
    getStaticHeaders,
    getStaticFooter,
    getDynamicColumn,
    getDynamicHeader,
    getDynamicFooter,
} from './generator';

import 'css!Controls-Lists-demo/dynamicGrid/horizontalNavigation/styles';

const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const VIEWPORT_WIDTH = 1555;
const STORE_ID = 'DemoDynamicGridStore';

const DynamicGridConnectedComponentMemo = React.memo(ConnectedComponent);

const Index = React.forwardRef(function Index(
    props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
    const onDynamicColumnClick: TDynamicColumnMouseEventCallback = React.useCallback(
        (model, event, columnKey) => {
            // eslint-disable-next-line
            console.log(model, event, columnKey);
        },
        []
    );

    const getRowProps = React.useCallback(() => {
        return {
            hoverBackgroundStyle: 'transparent',
        };
    }, []);

    return (
        <div className="tw-contents" ref={forwardedRef}>
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGrid__scrollContainer'}
            >
                <DynamicGridConnectedComponentMemo
                    className="controlsListsDemo__dynamicGrid__component"
                    storeId={STORE_ID}
                    getRowProps={getRowProps}
                    hoverMode="none"
                    onDynamicColumnClick={onDynamicColumnClick}
                    stickyFooter={true}
                    viewportWidth={VIEWPORT_WIDTH}
                />
            </ScrollContainer>
        </div>
    );
});

// @ts-ignore-next-line
Index.getLoadConfig = (): Record<string, IDataConfig<IDynamicGridDataFactoryArguments>> => {
    return {
        [STORE_ID]: {
            dataFactoryName: 'Controls-Lists/dynamicGrid:DynamicGridFactory',
            dataFactoryArguments: {
                source: new ExtSource({
                    keyProperty: 'key',
                }),
                keyProperty: 'key',
                navigation: {
                    source: 'position',
                    sourceConfig: {
                        field: 'key',
                        position: null,
                        direction: 'bothways',
                        limit: 1,
                    },
                },
                cellsMultiSelectVisibility: 'hidden',
                markerVisibility: 'hidden',
                columnsNavigation: {
                    sourceConfig: {
                        field: DYNAMIC_COLUMN_DATA_FIELD,
                        position: 0,
                        direction: 'bothways',
                        limit: 30,
                    },
                },
                staticColumns: getStaticColumns(),
                dynamicColumn: getDynamicColumn(),
                staticHeaders: getStaticHeaders(),
                dynamicHeader: getDynamicHeader(),
                staticFooter: getStaticFooter(),
                dynamicFooter: getDynamicFooter(),
            },
        },
    };
};

export default Index;