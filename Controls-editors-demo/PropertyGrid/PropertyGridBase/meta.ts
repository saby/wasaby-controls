import { NumberType, StringType, ObjectType } from 'Meta/types';
import { IPerson } from './interface';

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.attributes<IPerson>({
    name: StringType,
    age: NumberType,
    gender: GenderType,
});
