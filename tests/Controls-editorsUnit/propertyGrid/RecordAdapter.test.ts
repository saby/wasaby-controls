import { ObjectType, NumberType, VariantType, NullType } from 'Meta/types';
import {
    setRecordValue,
    getRecordAsObject,
} from 'Controls-editors/_propertyGrid/_adapter/RecordAdapter';
import { Record as EntityRecord, isRecord } from 'Types/entity';

describe('Controls-editors/propertyGrid Конвертация объекта в рекорд по метатипу', () => {
    it('На метатипе заданы свойства типа объект и два числа. Результат: в рекорд тип объекта представлен рекордом', () => {
        const metaType = ObjectType.properties({
            prop1: ObjectType.id('type1'),
            prop2: NumberType.order(2).id('type2'),
            prop3: NumberType.order(2).id('type2'),
        });

        const entityRecord = new EntityRecord();

        setRecordValue(
            entityRecord,
            {
                prop1: {},
                prop2: 1,
            },
            metaType
        );

        expect(entityRecord.getFormat().at(0).getType()).toEqual('record');
        expect(entityRecord.getFormat().at(1).getType()).toEqual('integer');
        // Даже если поле не задано, оно есть в формате
        expect(entityRecord.getFormat().at(2).getType()).toEqual('integer');
    });

    it('На метатипе заданы свойства типа вариативный тип и число. Результат: в рекорде значение вариативного типа представлено рекордом', () => {
        const metaType = ObjectType.properties({
            prop1: VariantType.invariant('jobType').of({ emptyType: NullType }),
        });

        const entityRecord = new EntityRecord();

        setRecordValue(
            entityRecord,
            {
                prop1: {
                    element_id: 'emptyType',
                    data: {},
                },
            },
            metaType
        );

        expect(entityRecord.get('prop1').getFormat().at(0).getType()).toEqual('string');
        expect(entityRecord.get('prop1').getFormat().at(1).getType()).toEqual('record');
        expect(isRecord(entityRecord.get('prop1').get('data'))).toBeTruthy();

        expect(getRecordAsObject(entityRecord)).toEqual({
            prop1: {
                element_id: 'emptyType',
                data: {},
            },
        });
    });
});
