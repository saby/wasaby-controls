import { ObjectType, StringType, BooleanType, NumberType } from 'Meta/types';
import { IPerson, IJob } from './interface';

export const PersonType = ObjectType.properties<IPerson>({
    name: StringType.title('Имя').order(1).optional().category('Основное'),
    surname: StringType.title('Фамилия').order(2).optional().category('Основное'),
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
        .category('Основное')
        .title('Работа')
        .id('ObjectMetaEditorDemo')
        .order(3)
        .optional(),
    dprop1: NumberType.title('Свойство 1').optional().order(5).category('Основное'),
    dprop2: NumberType.title('Свойство 2').optional().order(5).category('Основное'),
    dprop3: NumberType.title('Свойство 3').optional().order(5).category('Основное'),
    dprop4: NumberType.title('Свойство 4').optional().order(5).category('Основное'),
    dprop5: NumberType.title('Свойство 5').optional().order(5).category('Основное'),
    stress: BooleanType.title('Стрессоустойчивость').optional().order(4).category('Эмоциональные'),
    sprop1: NumberType.title('Свойство  11').optional().order(5).category('Эмоциональные'),
    sprop2: NumberType.title('Свойство  12').optional().order(5).category('Эмоциональные'),
    sprop3: NumberType.title('Свойство  13').optional().order(5).category('Эмоциональные'),
    sprop4: NumberType.title('Свойство  14').optional().order(5).category('Эмоциональные'),
    sprop5: NumberType.title('Свойство  15').optional().order(5).category('Эмоциональные'),
    height: NumberType.title('Рост').optional().order(5).category('Личные'),
    weight: NumberType.title('Вес').optional().order(5).category('Личные'),
    prop1: NumberType.title('Свойство 21').optional().order(5).category('Личные'),
    prop2: NumberType.title('Свойство 22').optional().order(5).category('Личные'),
    prop3: NumberType.title('Свойство 23').optional().order(5).category('Личные'),
    prop4: NumberType.title('Свойство 24').optional().order(5).category('Личные'),
    prop5: NumberType.title('Свойство 25').optional().order(5).category('Личные'),
}).title('Персона');
