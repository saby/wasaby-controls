import * as React from 'react';
import { adapter } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IRowProps } from 'Controls/gridReact';
import {
    ITimelineGridDataFactoryArguments,
    TimelineGridConnectedComponent,
} from 'Controls-Lists/timelineGrid';

import {
    default as getHolidaysCalendar,
    getHolidayConfig,
} from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import ExtMemory from './ExtMemory';
import { TGridVPaddingSize } from 'Controls/interface';
import { START_DATE } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import {
    dynamicColumnMinWidths,
    getDynamicColumn,
    VIEWPORT_WIDTH,
    DYNAMIC_COLUMN_DATA_FIELD,
    getStaticColumns,
    getStaticHeaders,
    STORE_ID,
    getInitialRange,
    FIXED_DATE,
} from 'Controls-Lists-demo/timelineGrid/WI/Offsets/renders/DemoRenderUtils';

import 'css!Controls-Lists-demo/timelineGrid/Sources/timelineDemo';
import 'css!Controls-Lists-demo/timelineGrid/WI/Offsets/styles';

interface ITimelineOffsetsDemo extends TInternalProps {
    padding?: TGridVPaddingSize;
}

/**
 * Демка для демонстрации настройки вертикальных отступов таймлайн таблицы.
 * @param props
 * @constructor
 */
function TimelineOffsetsDemo(props: ITimelineOffsetsDemo) {
    /**
     * Для настройки вертикальных отступов необходимо вернуть из коллбека getRowProps() объект, содержащий
     * поле padding с параметрами верхнего (top) отступа.
     * Поддерживается стандартная линейка отступов. (см. https://n.sbis.ru/article/global_variables)
     */
    const getRowProps = React.useCallback((): IRowProps => {
        return {
            padding: {
                top: props.padding, // Значение top="st" из defaultProps будет использовано для отрисовки отступа.
            },
        };
    }, [props.padding]);

    return (
        <div
            className="controlsListsDemo__timelineGrid_WI_Base"
            style={{ maxWidth: `${VIEWPORT_WIDTH}px` }}
        >
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className="controlsListsDemo__timelineGrid_WI_Base-scrollContainer"
            >
                <TimelineGridConnectedComponent
                    storeId={STORE_ID}
                    viewportWidth={VIEWPORT_WIDTH}
                    getRowProps={getRowProps}
                    fixedTimelineDate={FIXED_DATE}
                    dynamicColumnMinWidths={dynamicColumnMinWidths}
                    columnsSpacing={'null'}
                />
            </ScrollContainer>
        </div>
    );
}

/**
 * Демка для демонстрации отступов между строками
 */
export default Object.assign(React.forwardRef(TimelineOffsetsDemo), {
    getLoadConfig(): Record<string, IDataConfig<ITimelineGridDataFactoryArguments>> {
        return {
            [STORE_ID]: {
                dataFactoryName: 'Controls-Lists/timelineGrid:TimelineGridFactory',
                dataFactoryArguments: {
                    source: new ExtMemory({
                        keyProperty: 'key',
                        adapter: new adapter.Sbis(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    displayProperty: 'fullName',
                    root: null,
                    range: getInitialRange(),
                    columnsNavigation: {
                        sourceConfig: {
                            field: DYNAMIC_COLUMN_DATA_FIELD,
                        },
                    },
                    staticColumns: getStaticColumns(),
                    dynamicColumn: getDynamicColumn({
                        holidaysData: getHolidaysCalendar(START_DATE),
                        holidaysConfig: getHolidayConfig(),
                    }),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: {},
                },
            },
        };
    },
    defaultProps: {
        padding: 'st',
    } as ITimelineOffsetsDemo,
});
