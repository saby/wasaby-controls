import { NumberType, ObjectType, StringType, VariantType, BooleanType } from 'Meta/types';
import { IAccountant, IPerson, IEngineer } from './interface';

const AccountantType = ObjectType.attributes<IAccountant>({
    jobName: StringType.title('Должность').hidden(),
    experience: NumberType.title('Опыт').extended(),
    education: StringType.title('Образование').extended().optional(),
    salary: StringType.title('Зарплата').optional(),
}).title('Бухгалтер');

const ProgrammerType = ObjectType.attributes({
    jobType: StringType.title('Должность').hidden(),
    programmingLanguage: StringType.title('Язык программирования').optional(),
    experience: StringType.title('Стаж').optional(),
}).title('Программист');

const AdminType = ObjectType.attributes({
    jobType: StringType.title('Должность').hidden(),
    experience: StringType.title('Стаж').optional(),
}).title('Системный администратор');

const EngineerType = ObjectType.attributes<IEngineer>({
    jobName: StringType.title('Должность').hidden(),
    experience: NumberType.title('Опыт').extended(),
    salary: StringType.title('Зарплата').optional(),
    speciality: VariantType.invariant('jobType')
        .of({ programmer: ProgrammerType, admin: AdminType })
        .editor('Controls-editors/VariantEditor')
        .title('Специальность')
        .order(3),
    specialSkills: BooleanType.title('Особые навыки').optional(),
}).title('Инженер');

export const PersonType = ObjectType.attributes<IPerson>({
    name: StringType.title('Имя').order(1).optional(),
    surname: StringType.title('Фамилия').order(2).optional(),
    job: VariantType.invariant('jobName')
        .of({ engineer: EngineerType, accountant: AccountantType })
        .editor('Controls-editors/VariantEditor')
        .title('Должность')
        .order(3)
        .optional(),
    country: StringType.title('Страна').order(4).optional(),
});
