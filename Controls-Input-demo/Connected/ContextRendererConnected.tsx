import * as React from 'react';
import { TField, CONTEXT_OBJ } from '../resources/_dataContextMock';
import { DataContext } from 'Controls-DataEnv/context';
import { date } from 'Types/formatter';

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
    const store = slice.state.store;
    const record = store.getStore();
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
        <pre data-qa="controls-inputs_connected_context-state">
            {JSON.stringify(data, dateReplacer, 4)}
        </pre>
    );
}

function dateReplacer(key, value) {
    if (this[key] instanceof Date) {
        return date(this[key], date.FULL_DATE);
    }

    return value;
}
