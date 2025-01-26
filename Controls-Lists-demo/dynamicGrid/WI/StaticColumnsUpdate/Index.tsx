import * as React from 'react';
import type { IDataConfig } from 'Controls/dataFactory';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import {
    ConnectedComponent,
    IDynamicColumnConfig,
    IDynamicGridDataFactoryArguments,
} from 'Controls-Lists/dynamicGrid';

import 'css!Controls-Lists-demo/dynamicGrid/WI/Base/styles';
import ExtSource from 'Controls-Lists-demo/dynamicGrid/WI/StaticColumnsUpdate/source';
import { getStaticColumns, getStaticHeaders } from '../Base/generator';
import { useSlice } from 'Controls-DataEnv/context';
import {
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
} from 'Controls-Lists-demo/dynamicGrid/WI/Base/renders';
import { IHeaderConfig } from 'Controls/gridRender';

const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const VIEWPORT_WIDTH = 800;
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
                    dynamicColumnsCount={5}
                />
            </ScrollContainer>
        </div>
    );
}

export function getDynamicColumn(): IDynamicColumnConfig {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        width: 'auto',
        render: <DynamicColumnsRenderComponent />,
    };
}

export function getDynamicHeader(): IHeaderConfig {
    return {
        width: 'auto',
        render: <DynamicHeaderRenderComponent />,
    };
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
                            limit: 15,
                        },
                    },
                    cellsMultiSelectVisibility: 'hidden',
                    markerVisibility: 'hidden',
                    columnsNavigation: {
                        sourceConfig: {
                            field: DYNAMIC_COLUMN_DATA_FIELD,
                            position: 0,
                            direction: 'bothways',
                            limit: 15,
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
