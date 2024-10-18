import { ObjectType, StringType } from 'Meta/types';
import { IPerson, IJob } from './interface';

export const PersonType = ObjectType.properties<IPerson>({
    name: StringType.title('Имя').order(1).optional(),
    surname: StringType.title('Фамилия').order(2).optional(),
    job: ObjectType.properties<IJob>({
        jobName: StringType.title('Должность').optional(),
        salary: StringType.title('Зарплата').optional(),
    })
        .title('Работа')
        .id('ObjectMetaEditorDemo')
        .order(3)
        .optional(),
}).title('Персона');
