/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import type * as React from 'react';

export interface IContextWithSelfRef<T> {
    contextRefForHandlersOnly: React.MutableRefObject<T>;
}
