import { NumberType, ObjectType, StringType } from 'Meta/types';
import { IPerson } from './interface';

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.properties<IPerson>({
    name: StringType.required(),
    age: NumberType.required(),
    gender: GenderType.optional(),
});
