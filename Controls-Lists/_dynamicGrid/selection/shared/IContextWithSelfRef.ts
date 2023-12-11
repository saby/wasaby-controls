import type * as React from 'react';

export interface IContextWithSelfRef<T> {
    contextRefForHandlersOnly: React.MutableRefObject<T>;
}
