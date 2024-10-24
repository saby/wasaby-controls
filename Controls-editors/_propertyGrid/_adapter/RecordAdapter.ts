import { format, getValueType, Record } from 'Types/entity';
import { ObjectType, Meta, VariantType, StringType, VariantMeta } from 'Meta/types';
import { DISCRIMINATOR_FIELD } from 'Controls-editors/object-type';

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

function getRecordAsObject(record: Record): object {
    const result = {};
    const enumerator = record.getEnumerator();
    while (enumerator.moveNext()) {
        const key = enumerator.getCurrent();
        const keyValue = record.get(key);
        if (isRecordValue(keyValue)) {
            result[key] = getRecordAsObject(keyValue);
        } else {
            result[key] = keyValue;
        }
    }

    return result;
}

export function setRecordValue(record: Record, values: object, metaType: Meta<object>): void {
    if (!values) {
        return;
    }

    for (const key of Object.keys(values)) {
        let keyMetaType;
        if (metaType.is(VariantType)) {
            if (key === DISCRIMINATOR_FIELD) {
                keyMetaType = StringType;
            } else {
                keyMetaType = (metaType as VariantMeta).getTypes()[values[DISCRIMINATOR_FIELD]];
            }
        } else {
            keyMetaType = metaType.getProperties()[key];
        }
        let keyValue: any | Record = values[key];
        if (keyMetaType.is(ObjectType) || keyMetaType.is(VariantType)) {
            const valueAsRecord = new Record({
                adapter: record.getAdapter(),
            });
            setRecordValue(valueAsRecord, values[key], keyMetaType);
            keyValue = valueAsRecord;
        }

        if (!record.has(key)) {
            record.addField(getFieldDeclaration(key, keyValue));
        }

        record.set(key, keyValue);
    }
}

function getFieldDeclaration(name: string, value: unknown): format.IFieldDeclaration {
    const type = getValueType(value);

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
