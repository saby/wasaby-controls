import { ObjectType, StringType, BooleanType, NumberType } from 'Meta/types';
import { IPerson, IJob } from './interface';

export const PersonType = ObjectType.properties<IPerson>({
    name: StringType.title('Имя').order(1).optional().group('Основное'),
    surname: StringType.title('Фамилия').order(2).optional().group('Основное'),
    job: ObjectType.properties<IJob>({
        jobName: StringType.title('Должность').optional().order(1),
        salary: StringType.title('Зарплата').optional().order(2),
        additionalRequirements: ObjectType.title('Доп.требования')
            .properties({
                dontSmoke: BooleanType.title('Не курить').optional(),
                dontDrink: BooleanType.title('Не пить').optional(),
            })
            .order(3),
    })
        .group('Основное')
        .title('Работа')
        .id('ObjectMetaEditorDemo')
        .order(3)
        .optional(),
    skills: ObjectType.properties({
        stress: BooleanType.title('Стрессоустойчивость').optional().order(1),
        height: NumberType.title('Рост').optional().order(2),
    })
        .title('Навыки')
        .order(4)
        .optional()
        .group('Дополнительное'),
}).title('Персона');
