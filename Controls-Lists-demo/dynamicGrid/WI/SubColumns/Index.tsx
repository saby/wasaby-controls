import * as React from 'react';
import type { IDataConfig } from 'Controls/dataFactory';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import { ConnectedComponent, IDynamicGridDataFactoryArguments } from 'Controls-Lists/dynamicGrid';

import ExtSource from './source';
import {
    getStaticColumns,
    getStaticHeaders,
    getStaticFooter,
    getDynamicColumn,
    getDynamicHeader,
    getDynamicFooter,
} from './generator';

import 'css!Controls-Lists-demo/dynamicGrid/WI/Base/styles';

const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const VIEWPORT_WIDTH = 757;
const STORE_ID = 'SubColumnsDemoDynamicGridStore';

const DynamicGridConnectedComponentMemo = React.memo(ConnectedComponent);

function Demo(props, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div className="controlsListsDemo__dynamicGridBase" ref={forwardedRef}>
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <DynamicGridConnectedComponentMemo
                    storeId={STORE_ID}
                    viewportWidth={VIEWPORT_WIDTH}
                    stickyFooter={true}
                    className="controlsListsDemo__dynamicGridBase"
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IDynamicGridDataFactoryArguments>> {
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
    },
});
