import { IDataContextField } from './interface';
import { Model } from 'Types/entity';
import { object } from 'Types/util';

function getFieldNameByType(field: Model, type: string): string | undefined {
    const format = field.getFormat();
    let result: string | undefined;

    format.forEach((fieldFormat) => {
        const fieldName = fieldFormat.getName();
        const fieldValue = field.get(fieldName);

        if (fieldValue instanceof Model && fieldValue.getTypeName() === type) {
            result = fieldName;
        }
    });

    return result;
}

export default class DataContextLocalAPI {
    constructor(protected readonly _context: IDataContextField[] = []) {}

    getByPath(path: string = ''): unknown {
        const [contextFieldName, ...restPath] = path.split('.');
        const contextField = this.getByName(contextFieldName);
        return contextField && restPath.length
            ? object.extractValue(contextField, restPath)
            : contextField;
    }

    getByType(type: string): unknown {
        for (const { value } of this._context) {
            if (value instanceof Model) {
                if (value.getTypeName() === type) return value;
                const fieldName = getFieldNameByType(value, type);
                if (fieldName) return value.get(fieldName);
            }
        }
    }

    getByName(findName: string): unknown {
        for (const { name, value } of this._context) {
            if (findName === name) return value;
            if (value instanceof Model && value.has(findName)) return value.get(findName);
        }
    }
}
