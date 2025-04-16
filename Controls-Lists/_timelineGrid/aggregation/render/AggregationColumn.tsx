/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 * Предоставляет компонент для отображения шаблона дополнительной колонки
 * @class Controls-Lists/_timelineGrid/aggregation/render/AggregationColumn
 * @category component
 * @private
 */
import * as React from 'react';
import { AggregationContext } from '../context/Context';

function AggregationColumnConnected() {
    const ctx = React.useContext(AggregationContext);
    return ctx.columnRender ? ctx.columnRender : null;
}

export default AggregationColumnConnected;
