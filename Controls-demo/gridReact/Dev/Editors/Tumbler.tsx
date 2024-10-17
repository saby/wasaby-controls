import * as React from 'react';
import { RecordSet } from 'Types/collection';

import { Control as TumblerControl } from 'Controls/Tumbler';
import BaseSelector from './base/BaseSelector';

function valueToKey<T>(value: T): string {
    return `key_${value}`;
}

export function Tumbler<T>(props: { values: T[]; value: T; onValueChanged?: (value: T) => void }) {
    const keyProperty = 'key';
    const valuesRS = React.useMemo(() => {
        return new RecordSet({
            keyProperty,
            rawData: props.values.map((i) => ({
                key: valueToKey(i),
                display: String(i),
                value: i,
            })),
        });
    }, props.values);

    const onValueChanged = React.useCallback(
        (key: string) => {
            if (!props.onValueChanged) {
                return;
            }
            const value = valuesRS.getRecordById(key)?.get?.('value');
            props.onValueChanged(value);
        },
        [props.onValueChanged, valuesRS]
    );

    return (
        <TumblerControl
            keyProperty={keyProperty}
            displayProperty="display"
            items={valuesRS}
            selectedKey={valueToKey(props.value)}
            onSelectedKeyChanged={onValueChanged}
            customEvents={['onSelectedKeyChanged']}
        />
    );
}

export function useTumbler<T>(
    optionName: string | undefined,
    values: T[],
    initialValue: T,
    onValueChange?: (value: T) => void
): [value: T, Editor: JSX.Element] {
    const [state, setState] = React.useState<T>(initialValue);
    const vars = React.useMemo(() => values, []);

    const onValueChangedCB = React.useCallback(
        (value: T) => {
            setState(value);
            onValueChange?.(value);
        },
        [onValueChange]
    );

    const Editor =
        typeof optionName === 'undefined' ? (
            <Tumbler values={vars} value={state} onValueChanged={onValueChangedCB} />
        ) : (
            <BaseSelector header={optionName} className={'ws-align-items-center'}>
                <Tumbler values={vars} value={state} onValueChanged={onValueChangedCB} />
            </BaseSelector>
        );
    return [state, Editor];
}
