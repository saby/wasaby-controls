import { format, getValueType, Record } from 'Types/entity';
import {
    ObjectType,
    Meta,
    VariantType,
    StringType,
    VariantMeta,
    NullType,
    NumberType,
    DateType,
    BooleanType,
} from 'Meta/types';
import { DISCRIMINATOR_FIELD, TYPE_VALUE_FIELD } from 'Controls-editors/object-type';

/**
 * Адаптер для работы {@link Controls-editors/propertyGridConnected:PropertyGrid PropertyGrid} с {@link Types/entity:Record Record}
 */
export class RecordAdapter {
    constructor(
        private readonly _record: Record,
        private readonly _meta: Meta<object>
    ) {}

    getRecord(): Record {
        return this._record;
    }

    set(val: object): void {
        const iterated = new Set<string>(Object.keys(val));

        setRecordValue(this._record, val, this._meta);

        // удаляем из рекорда поля, которых не было в объекте
        const enumerator = this._record.getEnumerator();
        while (enumerator.moveNext()) {
            const key = enumerator.getCurrent();
            if (!iterated.has(key)) {
                this._record.set(key, null);
            }
        }
    }

    get(): object {
        return getRecordAsObject(this._record);
    }
}

export function isRecordValue(value: any): boolean {
    return typeof value === 'object' && !!value && !!value['[Types/_entity/Record]'];
}

export function getRecordAsObject(record: Record): object {
    const result = {};
    const enumerator = record.getEnumerator();
    while (enumerator.moveNext()) {
        const key = enumerator.getCurrent();
        const keyValue = record.get(key);
        if (isRecordValue(keyValue)) {
            result[key] = getRecordAsObject(keyValue);
        } else {
            result[key] = keyValue === null ? undefined : keyValue;
        }
    }

    return result;
}

export function setRecordValue(record: Record, value: object, metaType: Meta<object>): void {
    const preparedValue: Record<string, unknown> = {
        ...(value ?? {}),
    };

    const metaTypeProperties =
        metaType.getProperties !== undefined
            ? (metaType.getProperties() as Record<string, Meta<any>>)
            : undefined;
    if (metaTypeProperties !== undefined) {
        for (const propertyName of Object.keys(metaTypeProperties)) {
            if (!preparedValue.hasOwnProperty(propertyName)) {
                preparedValue[propertyName] = undefined;
            }
        }
    }

    for (const key of Object.keys(preparedValue)) {
        let keyMetaType;
        if (metaType.is(VariantType)) {
            if (key === DISCRIMINATOR_FIELD) {
                keyMetaType = StringType;
            } else {
                keyMetaType = (metaType as VariantMeta).getTypes()[
                    preparedValue[DISCRIMINATOR_FIELD]
                ];
            }
        } else {
            keyMetaType = metaTypeProperties[key];
        }
        let keyValue: any | Record = preparedValue[key];
        if (keyMetaType.is(ObjectType) || keyMetaType.is(VariantType) || keyMetaType.is(NullType)) {
            const valueAsRecord = new Record({
                adapter: record.getAdapter(),
            });
            setRecordValue(valueAsRecord, preparedValue[key], keyMetaType);
            keyValue = valueAsRecord;
        }

        if (!record.has(key)) {
            if (metaType.is(VariantType) && key === TYPE_VALUE_FIELD) {
                record.addField({
                    name: key,
                    type: 'record',
                });
            } else {
                record.addField(getFieldDeclaration(key, keyValue, keyMetaType));
            }
        }

        record.set(key, keyValue);
    }
}

function getFieldDeclaration(
    name: string,
    value: unknown,
    metaType?: Meta<unknown>
): format.IFieldDeclaration {
    let type: any;
    if (value === undefined && !!metaType) {
        if (metaType.is(NumberType)) {
            type = 'integer';
        } else if (metaType.is(StringType)) {
            type = 'string';
        } else if (metaType.is(DateType)) {
            type = 'date';
        } else if (metaType.is(BooleanType)) {
            type = 'boolean';
        }
    } else {
        type = getValueType(value);
    }

    if (type !== null && typeof type === 'object') {
        return {
            name,
            ...type,
        };
    }

    return {
        name,
        type,
    };
}
