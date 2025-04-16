import { useCallback, useMemo } from 'react';
import { isRecordValue, RecordAdapter, getRecordAsObject } from './_adapter/RecordAdapter';
import { Record as EntityRecord } from 'Types/entity';
import { ObjectMeta } from 'Meta/types';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';

type TRecordGetter = (newValue: object, meta: ObjectMeta<object>) => EntityRecord | object;

export function useRecordValue<T extends object = object>(
    value: EntityRecord | T | undefined
): [T | undefined, TRecordGetter, boolean] {
    const isValueRecord = isRecordValue(value);
    const recordVersion = isValueRecord ? (value as EntityRecord).getVersion() : undefined;

    const result = useMemo(() => {
        if (isValueRecord && recordVersion !== undefined) {
            return getRecordAsObject(value as EntityRecord) as T;
        }

        return value as T;
    }, [isValueRecord, recordVersion, value]);

    const getRecord = useCallback(
        (newValue: object, meta: ObjectMeta<object>) => {
            if (isValueRecord) {
                const adapter = new RecordAdapter(value as EntityRecord, meta);
                adapter.set(newValue);
                return adapter.getRecord().clone();
            }

            return newValue;
        },
        [value, isValueRecord]
    );

    return [result, getRecord, isValueRecord];
}
