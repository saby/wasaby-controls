import { Context, IContext } from 'Controls-editors/_recordset/context/MetaTypeContextProvider';
import * as React from 'react';
import { ObjectMeta } from 'Meta/types';

export function useMetaType(): ObjectMeta<unknown> {
    const context = React.useContext<IContext>(Context);
    return context.metaType;
}
