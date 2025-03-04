import { Context, IContext } from 'Controls-editors/_recordset/context/MetaTypeContextProvider';
import * as React from 'react';
import { Meta } from 'Meta/types';

export function useMetaType(): Meta<unknown> {
    const context = React.useContext<IContext>(Context);
    return context.metaType;
}
