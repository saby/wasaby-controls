import * as React from 'react';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';
import {
    IColumnConfig,
    useRenderData as useGridRenderData,
    IRenderData,
    getRenderValues,
    TColumnWidth,
    ICellProps,
} from 'Controls/gridReact';

import { getDateClassName } from './utils';

import { IHeaderCell } from 'Controls/grid';

const DYNAMIC_COLUMN_PREFIX = '$DYNAMIC_COLUMN_';
const DYNAMIC_HEADER_PREFIX = '$DYNAMIC_HEADER_';

interface IGetDynamicColumn {
    render: React.ReactElement;
    dataProperty: string;
    displayProperty: string;
    columnIndex: number;
    width: TColumnWidth;
}

// Тип принимает в себя тип рекорда и извлекает из него тип "сырых" данных
type RawData<T> = T extends Model<infer DataType> ? DataType : never;

const DynamicGridContext = React.createContext(null);

/**
 * Хук для получения данных для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля, при изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
// export function useRenderData<
//    TItem extends Model = Model,
//    TRawData = RawData<TItem>
//    >(properties?: readonly (keyof TRawData)[]): IRenderData<TItem> {
//    const item = React.useContext(DynamicGridContext);
//    return useWatchRecord(item, properties);
// }
export function useRenderData<
    TItem extends Model = Model,
    TRawData = RawData<TItem>
>(properties?: readonly (keyof TRawData)[]): IRenderData<TItem> {
    const { renderData, columnIndex } = React.useContext(DynamicGridContext);
    const item = renderData.at(columnIndex);
    return {
        item,
        renderValues: getRenderValues(item, properties),
    };
}

// export function DynamicColumn(props: IGetDynamicColumn): React.ReactElement {
//    const { render, dataProperty, columnIndex } = props;
//    const { renderValues } = useGridRenderData([dataProperty]);
//    const renderData = renderValues[dataProperty];
//
//    return (
//       <DynamicGridContext.Provider value={ renderData ? renderData.at(columnIndex) : null }>
//          {render}
//       </DynamicGridContext.Provider>
//    );
// }

export const DynamicColumn = React.memo(function MemoizedDynamicColumn(
    props: IGetDynamicColumn
): React.ReactElement {
    const { render, dataProperty, width } = props;
    const { renderValues } = useGridRenderData([dataProperty]);
    const renderData = renderValues[dataProperty];

    return (
        <>
            {factory(renderData)
                .map((value, index: number) => {
                    const date = renderData.at(index).get('key');
                    const backgroundColor =
                        parseInt(date, 10) % 2 === 0
                            ? 'aliceblue'
                            : 'navajowhite';
                    const style = {
                        padding: '0 6px',
                        minWidth: width,
                        maxWidth: width,
                        fontSize: '7px',
                        height: '100%',
                        boxSizing: 'border-box',
                        backgroundColor,
                    };
                    // todo не забыть поправить
                    // eslint-disable-next-line
                    // const contextValue = {
                    //     renderData,
                    //     columnIndex: index,
                    // };
                    // <DynamicGridContext.Provider value={contextValue}>{render}</DynamicGridContext.Provider>
                    return (
                        // todo использовать дату в качестве ключа ячейки (вместо title)
                        // eslint-disable-next-line
                        <div
                            style={style}
                            key={date.getTime()}
                            className={getDateClassName(date)}
                        >
                            {React.cloneElement(render, {
                                dynamicTitle: renderData
                                    .at(index)
                                    .get('dynamicTitle'),
                            })}
                        </div>
                    );
                })
                .value()}
        </>
    );
});

export function getPreparedDynamicColumn(
    dataProperty: string,
    columnIndex: number,
    dynamicColumn: IColumnConfig
): IColumnConfig {
    return {
        ...dynamicColumn,
        key: DYNAMIC_COLUMN_PREFIX + columnIndex,
        render: (
            <DynamicColumn
                render={dynamicColumn.render}
                columnIndex={columnIndex}
                displayProperty={dynamicColumn.displayProperty}
                dataProperty={dataProperty}
                width={dynamicColumn.width}
            />
        ),
        getCellProps: (): ICellProps => {
            return {
                // todo реализовать
                // className: DYNAMIC_COLUMN_CLASS,
                padding: {
                    left: 'null',
                    right: 'null',
                },
                valign: 'center',
            };
        },
    };
}

interface IDynamicHeaderRender {
    col: number;
}

function DynamicHeaderRender(props: IDynamicHeaderRender): React.ReactElement {
    const style = {
        background: '#eee',
        width: '100%',
    };
    return <div style={style}>{props.col + 1}</div>;
}

export function getPreparedDynamicHeader(
    property: string,
    col: number,
    dynamicHeader: IHeaderCell
): IColumnConfig {
    return {
        ...dynamicHeader,
        render: <DynamicHeaderRender col={col} />,
        key: DYNAMIC_HEADER_PREFIX + col,
    };
}
