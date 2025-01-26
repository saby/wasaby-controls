import * as React from 'react';
import type { IDataConfig } from 'Controls/dataFactory';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import { ConnectedComponent, IDynamicGridDataFactoryArguments } from 'Controls-Lists/dynamicGrid';

import 'css!Controls-Lists-demo/dynamicGrid/WI/Base/styles';
import ExtSource from 'Controls-Lists-demo/dynamicGrid/WI/Base/source';
import {
    getDynamicColumn,
    getDynamicHeader,
    getStaticColumns,
    getStaticHeaders,
} from '../Base/generator';
import { useSlice } from 'Controls-DataEnv/context';

const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const VIEWPORT_WIDTH = 757;
const STORE_ID = 'DemoDynamicGridStore';

const DynamicGridConnectedComponentMemo = React.memo(ConnectedComponent);

function Demo(props, forwardedRef) {
    const slice = useSlice(STORE_ID);
    const [staticColumnWidth, setStaticColumnWidth] = React.useState('200px');

    const handleWidthChange = (event) => {
        const newWidth = event.target.value;
        setStaticColumnWidth(newWidth);
        if (slice) {
            slice.setState({ staticColumns: [{ ...getStaticColumns()[0], width: newWidth }] });
        }
    };

    return (
        <div className="controlsListsDemo__dynamicGridBase" ref={forwardedRef}>
            Ширина статической колонки
            <div style={{ marginBottom: '50px' }}>
                <label style={{ marginRight: '15px' }}>
                    <input
                        type="radio"
                        value="100px"
                        checked={staticColumnWidth === '100px'}
                        onChange={handleWidthChange}
                    />
                    100px
                </label>
                <label style={{ marginRight: '15px' }}>
                    <input
                        type="radio"
                        value="200px"
                        checked={staticColumnWidth === '200px'}
                        onChange={handleWidthChange}
                    />
                    200px
                </label>
                <label style={{ marginRight: '15px' }}>
                    <input
                        type="radio"
                        value="300px"
                        checked={staticColumnWidth === '300px'}
                        onChange={handleWidthChange}
                    />
                    300px
                </label>
            </div>
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <DynamicGridConnectedComponentMemo
                    storeId={STORE_ID}
                    viewportWidth={VIEWPORT_WIDTH}
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
                            limit: 10,
                        },
                    },
                    staticColumns: getStaticColumns(),
                    dynamicColumn: getDynamicColumn(),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: getDynamicHeader(),
                },
            },
        };
    },
});
