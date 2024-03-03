/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';
import { AggregationContext } from '../context/Context';

function AggregationColumnConnected() {
    const ctx = React.useContext(AggregationContext);
    return ctx.columnRender ? ctx.columnRender : null;
}

export default AggregationColumnConnected;
