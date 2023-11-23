import * as React from 'react';
import { AggregationContext } from '../context/Context';

function AggregationColumnConnected() {
    const ctx = React.useContext(AggregationContext);
    return ctx.columnRender ? ctx.columnRender : null;
}

export default AggregationColumnConnected;
