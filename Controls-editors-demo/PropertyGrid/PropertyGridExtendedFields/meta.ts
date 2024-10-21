import { NumberType, ObjectType, StringType } from 'Meta/types';
import { IPerson } from './interface';

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.properties<IPerson>({
    name: StringType,
    age: NumberType,
    gender: GenderType.extended(),
});
