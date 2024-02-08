import { Model as SbisRecord } from 'Types/entity';
import { object } from 'Types/util';
import { getFieldDeclaration } from './recordHelpers';

type DataType = SbisRecord | object;

function setPropertyValue(model: DataType, property: string, value: unknown): unknown {
    if (isIObject(model)) {
        return setIObjectValue(model, property, value);
    }
    if (isPlainObject(model)) {
        return setPlainObjectValue(model, property, value);
    }
}

function setIObjectValue(model: SbisRecord, part: string, value: unknown): unknown {
    if (!model.has(part)) {
        // Попытка записать новое поле
        // FIXME: возможно это поведение следует сделать опциональным, т.к. поля объекта системы зафиксированы
        model.addField(getFieldDeclaration(part, value));
    }

    object.setPropertyValue(model, part, value);
    return value;
}

function setPlainObjectValue(obj: object, part: string, value: unknown): unknown {
    return (obj[part] = value);
}

function isPlainObject(obj: DataType): obj is object {
    return typeof obj === 'object' && !obj['[Types/_entity/IObject]'];
}

function isIObject(obj: unknown): obj is SbisRecord {
    return typeof obj === 'object' && obj['[Types/_entity/IObject]'];
}

export { setPropertyValue, isIObject, isPlainObject };