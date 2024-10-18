import { NumberType, ObjectType, StringType, group } from 'Meta/types';
import { IPerson } from './interface';

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.properties<IPerson>({
    name: StringType,
    ...group('Дополнительно', {
        age: NumberType,
        gender: GenderType,
    }),
});
