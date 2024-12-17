import { format, getValueType, Record } from 'Types/entity';
import { IAdapter } from './factory';

/**
 * Адаптер для работы {@link Controls-editors/propertyGridConnected:PropertyGrid PropertyGrid} с {@link Types/entity:Record Record}
 */
export class RecordAdapter implements IAdapter {
    constructor(private readonly _record: Record) {}

    set(val: object): void {
        const iterated = new Set<string>();

        // добавляем новые значения из объекта
        for (const key in val) {
            if (val.hasOwnProperty(key)) {
                const value = val[key];
                if (!this._record.has(key)) {
                    this._record.addField(this._getFieldDeclaration(key, value));
                }
                this._record.set(key, value);
                iterated.add(key);
            }
        }
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
        const result = {};
        const enumerator = this._record.getEnumerator();
        while (enumerator.moveNext()) {
            const key = enumerator.getCurrent();
            result[key] = this._record.get(key);
        }

        return result;
    }

    private _getFieldDeclaration(name: string, value: unknown): format.IFieldDeclaration {
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
}
