/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';
import { TQuantumType } from 'Controls-Lists/dynamicGrid';
import { Selector } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';
import { useHandler } from 'Controls/Hooks/useHandler';
import { AggregationContext } from '../context/Context';

type TAggregationHeaderDefaultProps = {};

type TAggregationHeaderProps = Partial<TAggregationHeaderDefaultProps> & {
    quantum: TQuantumType;
    onQuantumChangedCallback?: (quantum: TQuantumType) => void;
};

type TKey = TQuantumType;

const KEY_PROPERTY = 'id';
const DISPLAY_PROPERTY = 'caption';

const ITEMS = new RecordSet<{
    [KEY_PROPERTY]: TKey;
    [DISPLAY_PROPERTY]: string;
}>({
    keyProperty: KEY_PROPERTY,
    rawData: [
        {
            [KEY_PROPERTY]: 'hour',
            [DISPLAY_PROPERTY]: 'Часы',
        },
        {
            [KEY_PROPERTY]: 'day',
            [DISPLAY_PROPERTY]: 'Дни',
        },
    ],
});

const CUSTOM_EVENTS = ['onSelectedKeysChanged'];

type TSelectedKeys = TKey[];

function AggregationHeader(props: TAggregationHeaderProps): JSX.Element {
    const onQuantumChangedUserHandler = useHandler(props.onQuantumChangedCallback);
    const [selectedKeys, setSelectedKeys] = React.useState<TSelectedKeys>([props.quantum]);

    const onSelectedKeysChanged = React.useCallback((value: TSelectedKeys) => {
        setSelectedKeys(value);
        onQuantumChangedUserHandler?.(value[0]);
    }, []);

    return (
        <div>
            <Selector
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                keyProperty={KEY_PROPERTY}
                displayProperty={DISPLAY_PROPERTY}
                items={ITEMS}
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onSelectedKeysChanged}
                customEvents={CUSTOM_EVENTS}
                data-qa="Controls-Lists_timelineGrid__AggregationHeader"
            />
        </div>
    );
}

const AggregationHeaderMemo = React.memo(AggregationHeader);

function AggregationHeaderConnected() {
    const ctx = React.useContext(AggregationContext);
    return (
        <AggregationHeaderMemo quantum={ctx.quantum} onQuantumChangedCallback={ctx.setQuantum} />
    );
}

export default AggregationHeaderConnected;
