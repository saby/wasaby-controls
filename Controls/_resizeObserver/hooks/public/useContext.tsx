/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { Context, TUnobserveCallback } from '../../Context';

export { TUnobserveCallback };

export function useObserve() {
    const ctx = React.useContext(Context);
    return ctx.observe;
}
