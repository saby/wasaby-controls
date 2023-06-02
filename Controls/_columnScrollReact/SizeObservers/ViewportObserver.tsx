import * as React from 'react';
import ObservableDivComponent, { IObservableDivComponentProps } from './ObservableDiv';
import { ColumnScrollContext, PrivateContextUserSymbol } from '../context/ColumnScrollContext';

export default React.memo(function ViewportObserverComponent(): JSX.Element {
    const context = React.useContext(ColumnScrollContext);
    const onResize = React.useCallback<IObservableDivComponentProps['onResize']>(
        (viewPortWidth: number) => {
            const ctx = context.contextRefForHandlersOnly.current;
            ctx.updateSizes(PrivateContextUserSymbol, {
                viewPortWidth,
            });
        },
        []
    );
    return <ObservableDivComponent onResize={onResize} />;
});
