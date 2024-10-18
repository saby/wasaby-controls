import { ObjectType, StringType, VariantType, BooleanType, NullType } from 'Meta/types';
import { IAccountant, IPerson, IEngineer } from './interface';

const EmptyType = NullType.title('Пустой тип');

const AccountantType = ObjectType.properties<IAccountant>({
    jobName: StringType.title('Должность').hidden(),
    salary: StringType.title('Зарплата').optional(),
}).title('Бухгалтер');

const ProgrammerType = ObjectType.properties({
    jobType: StringType.title('Должность').hidden(),
    programmingLanguage: StringType.title('Язык программирования').optional(),
    experience: StringType.title('Стаж').optional(),
    lastJob: StringType.title('Последнее место работы').extended('Последнее место работы'),
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
        .editor('Controls-editors/VariantEditor')
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

export const PersonType = ObjectType.properties<IPerson>({
    name: StringType.title('Имя').order(1).optional(),
    surname: StringType.title('Фамилия').order(2).optional(),
    job: VariantType.invariant('jobName')
        .of({ engineer: EngineerType, accountant: AccountantType, emptyType: EmptyType })
        .editor('Controls-editors/VariantEditor')
        .title('Должность')
        .order(3)
        .optional(),
    country: StringType.title('Страна').order(4).optional(),
});
