import { ObjectType, NumberType, VariantType, NullType } from 'Meta/types';
import {
    setRecordValue,
    getRecordAsObject,
} from 'Controls-editors/_propertyGrid/_adapter/RecordAdapter';
import { Record as EntityRecord } from 'Types/entity';

describe('Controls-editors/propertyGrid Конвертация объекта в рекорд по метатипу', () => {
    it('На метатипе заданы свойства типа объект и число. Результат: в рекорд тип объекта представлен рекордом', () => {
        const metaType = ObjectType.properties({
            prop1: ObjectType.id('type1'),
            prop2: NumberType.order(2).id('type2'),
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

        expect(getRecordAsObject(entityRecord)).toEqual({
            prop1: {
                element_id: 'emptyType',
                data: {},
            },
        });
    });
});
