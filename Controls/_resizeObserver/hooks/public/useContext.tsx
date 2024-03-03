/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { Context, TUnobserveCallback } from '../../Context';

export { TUnobserveCallback };

export function useObserve() {
    const ctx = React.useContext(Context);
    return ctx.observe;
}
