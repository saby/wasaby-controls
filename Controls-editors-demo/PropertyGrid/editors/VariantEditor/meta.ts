import { NumberType, ObjectType, StringType, VariantType, BooleanType } from 'Meta/types';
import { IAccountant, IPerson, IEngineer } from './interface';

const AccountantType = ObjectType.attributes<IAccountant>({
    jobName: StringType.title('Должность').hidden(),
    experience: NumberType.title('Опыт').extended(),
    education: StringType.title('Образование').extended().optional(),
    salary: StringType.title('Зарплата').optional(),
}).title('Бухгалтер');

const EngineerType = ObjectType.attributes<IEngineer>({
    jobName: StringType.title('Должность').hidden(),
    experience: NumberType.title('Опыт').extended(),
    salary: StringType.title('Зарплата').optional(),
    speciality: StringType.oneOf(['Программист', 'Механик'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Программист', 'Механик'],
        })
        .title('Специальность')
        .defaultValue('Программист')
        .optional(),
}).title('Инженер');

export const PersonType = ObjectType.attributes<IPerson>({
    name: StringType.title('Имя').order(1),
    surname: StringType.title('Фамилия').order(2),
    job: VariantType.invariant('jobName')
        .of({ engineer: EngineerType, accountant: AccountantType })
        .editor('Controls-editors/VariantEditor')
        .title('Должность')
        .order(3),
    country: StringType.title('Страна').order(4).optional(),
});
