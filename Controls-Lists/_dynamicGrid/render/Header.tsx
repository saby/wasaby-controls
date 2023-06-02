import * as React from 'react';
import { factory } from 'Types/chain';
import { IHeaderConfig, CellComponent } from 'Controls/gridReact';
import { getDynamicHeaderCellClass } from './utils';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';

export type TIsHolidayCallback = (date: Date) => boolean;

const DYNAMIC_HEADER_PREFIX = '$DYNAMIC_HEADER_';
const CLASS_HEADER_DYNAMIC_CELL = 'ControlsLists-dynamicGrid__headerDynamicCell';

/*
export function getPreparedDynamicHeader(
    date: Date,
    dynamicHeader: IHeaderConfig,
    isHolidayCallback: TIsHolidayCallback
): IColumnConfig {
    return {
        ...dynamicHeader,
        key: DYNAMIC_HEADER_PREFIX + date.getTime(),
        render: <DynamicHeaderRender date={date} />,
        getCellProps: () => {
            const customProps = dynamicHeader?.getCellProps?.();
            const isHoliday = isHolidayCallback ? isHolidayCallback(date) : false;
            return {
                ...customProps,
                backgroundStyle: customProps ? customProps.backgroundStyle : 'unaccented',
                valign: customProps ? customProps.valign : 'center',
                fontColorStyle: isHoliday ? 'danger' : 'secondary',
            };
        },
    };
}
*/

interface IDynamicCellsProps {
    render: React.ReactElement;
    dynamicColumnsGridData: unknown[];
}

export const HeaderDynamicCells = React.memo(function MemoizedDynamicColumn(
    props: IDynamicCellsProps
): React.ReactElement {
    const { render, dynamicColumnsGridData } = props;

    return (
        <>
            {factory(dynamicColumnsGridData)
                .map((value, index: number) => {
                    const date = dynamicColumnsGridData[index] as Date;
                    const renderValues = {
                        date,
                    };
                    const ContentRender = React.cloneElement(render, {
                        renderValues,
                    });
                    return (
                        <CellComponent
                            key={DYNAMIC_HEADER_PREFIX + date.getTime()}
                            className={
                                CLASS_HEADER_DYNAMIC_CELL +
                                ' ' +
                                getDynamicHeaderCellClass(renderValues.date)
                            }
                            render={ContentRender}
                            paddingLeft={null}
                            paddingRight={null}
                            paddingTop={null}
                            paddingBottom={null}
                            backgroundStyle="unaccented"
                        />
                    );
                })
                .value()}
        </>
    );
});

interface IGetPreparedDynamicHeaderProps extends IBaseDynamicColumnProps {
    columnIndex: number;
    dynamicHeader: IHeaderConfig;
    dynamicColumnsGridData: unknown[];
}

export function getPreparedDynamicHeader(props: IGetPreparedDynamicHeaderProps) {
    const {
        columnIndex,
        dynamicColumn,
        dynamicHeader,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps: dynamicHeader.getCellProps,
        key: DYNAMIC_HEADER_PREFIX + columnIndex,
        render: (
            <HeaderDynamicCells
                render={dynamicHeader.render}
                dynamicColumnsGridData={dynamicColumnsGridData}
            />
        ),
    });
}
