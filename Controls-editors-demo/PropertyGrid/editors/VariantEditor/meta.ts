import {
    ObjectType,
    StringType,
    VariantType,
    BooleanType,
    NullType,
    group,
    NumberType,
    ArrayType,
} from 'Meta/types';
import { IAccountant, IPerson, IEngineer } from './interface';

const EmptyType = NullType.title('Пустой тип');

const AccountantType = ObjectType.properties<IAccountant>({
    jobName: StringType.title('Должность').hidden(),
    salary: StringType.title('Зарплата').optional(),
}).title('Бухгалтер');

const itemType = ObjectType.properties<IMetaType>({
    key: StringType.title('Ключ').required(),
    name: StringType.title('Название'),
    type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
        })
        .defaultValue('Auto')
        .title('Тип'),
    comment: StringType.title('Комментарий').optional(),
    unique: BooleanType.defaultValue(true).title('Уникальный').optional(),
});

const ProgrammerType = ObjectType.properties({
    jobType: StringType.title('Должность').hidden(),
    programmingLanguage: StringType.title('Язык программирования').optional(),
    experience: StringType.title('Стаж').optional(),
    lastJob: StringType.title('Последнее место работы')
        .description('Описание последнего места работы')
        .extended('Последнее место работы'),
    placesOfWork: ArrayType.id('TestType')
        .of(itemType)
        .title('Места работы')
        .description('Места работы2'),
}).title('Программист');

const AdminType = ObjectType.properties({
    jobType: StringType.title('Должность').hidden(),
    experience: StringType.title('Стаж').optional(),
    lastJob: StringType.title('Последнее место работы')
        .extended('Последнее место работы')
        .disable(),
}).title('Системный администратор');

const EngineerType = ObjectType.properties<IEngineer>({
    jobName: StringType.title('Должность').hidden(),
    salary: StringType.title('Зарплата').optional(),
    speciality: VariantType.invariant('jobType')
        .of({ programmer: ProgrammerType, admin: AdminType, emptyType: EmptyType })
        .title('Специальность')
        .order(3),
    specialSkills: BooleanType.title('Особые навыки').optional(),
})
    .title('Инженер')
    .defaultValue({
        speciality: {
            element_id: 'programmer',
            data: {
                programmingLanguage: 'JavaScript',
                experience: '10',
            },
        },
    });

export const JobType = VariantType.invariant('jobName')
    .of({ engineer: EngineerType, accountant: AccountantType, emptyType: EmptyType })
    .title('Должность')
    .order(3)
    .optional();

export const PersonType = ObjectType.properties<IPerson>({
    name: StringType.title('Имя').order(1).optional(),
    surname: StringType.title('Фамилия').order(2).optional(),
    job: JobType,
    placesOfWork: ArrayType.id('TestType')
        .of(itemType)
        .title('Места работы')
        .description('Места работы1'),
    country: StringType.title('Страна').order(4).optional(),
    dataType: VariantType.invariant('value')
        .title('Тип данных')
        .of({
            ...group('Скаляры', {
                bool: ObjectType.title('Boolean').properties({
                    value: BooleanType.title('Значение'),
                }),
                integer: ObjectType.title('Integer').properties({
                    value: NumberType.title('Значение'),
                    desc: StringType.title('Описание типа'),
                }),
                float: ObjectType.title('Time').properties({
                    value: NumberType.title('Значение'),
                    is24: BooleanType.title('24 часа'),
                }),
            }),
            ...group('Массивы', {
                boolArray: ObjectType.title('Boolean Array').properties({
                    value: BooleanType.title('Все значения'),
                    count: NumberType.title('Количество элементов'),
                }),
                stringArray: ObjectType.title('String Array').properties({
                    value: StringType.title('Значение'),
                }),
            }),
            obj: ObjectType.title('Объект').properties({
                value: StringType.title('Значение'),
                isJSONML: BooleanType.title('JSONML'),
            }),
        }),
});
