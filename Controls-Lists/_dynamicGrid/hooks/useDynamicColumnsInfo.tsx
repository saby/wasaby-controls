import * as React from 'react';
import {
    DynamicColumnsInfoContext,
    IDynamicColumnsInfoContextValue,
} from 'Controls-Lists/_dynamicGrid/context/DynamicColumnsInfoContext';

type IColumnsInfo = IDynamicColumnsInfoContextValue;

/**
 * Публичный хук, позволяющий получить данные из контекста DynamicColumnsInfoContext.
 * */
function useDynamicColumnsInfo(): IColumnsInfo {
    const { columnsCount, visibleRange, columnWidth } = React.useContext(DynamicColumnsInfoContext);
    return {
        columnsCount,
        visibleRange,
        columnWidth,
    };
}

export { useDynamicColumnsInfo, IColumnsInfo };
