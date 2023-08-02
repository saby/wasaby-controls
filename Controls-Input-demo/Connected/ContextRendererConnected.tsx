import * as React from 'react';
import { TField, CONTEXT_OBJ } from './_dataContextMock';
import { DataContext } from 'Controls-DataEnv/context';

type Props = {
    name?: TField;
};

/**
 * Отрисовывает текущее состояние контекста целиком.
 * @param props
 * @constructor
 */
export function ContextRendererConnected(props: Props) {
    const context = React.useContext(DataContext);
    const slice = context[CONTEXT_OBJ];
    const record = slice.state.store;
    const [data, setData] = React.useState(record.getRawData());

    const handler = React.useCallback(() => {
        setData(record.getRawData());
    }, [record]);

    React.useEffect(() => {
        record.subscribe('onPropertyChange', handler);

        return () => {
            record.unsubscribe('onPropertyChange', handler);
        };
    }, []);

    return (
        <pre data-qa="controls-inputs_connected_context-state">{JSON.stringify(data, null, 4)}</pre>
    );
}
