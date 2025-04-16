import { NumberType, StringType, ObjectType } from 'Meta/types';
import { IPerson } from './interface';

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

const JobType = ObjectType.id('Job')
    .title('Работа')
    .properties({
        title: StringType.title('Название'),
        description: StringType.title('Описание'),
    });

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.properties<IPerson>({
    name: StringType,
    age: NumberType.defaultValue(20),
    gender: GenderType,
    job: JobType,
});
