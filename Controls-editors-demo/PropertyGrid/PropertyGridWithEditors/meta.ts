import { ArrayType, NumberType, ObjectType, StringType } from 'Meta/types';
import { IHobby, IPerson } from './interface';

// Мета-описание интерфейса IHobby
const IHobbyType = ObjectType.attributes<IHobby>({
    value: NumberType,
    caption: StringType,
});

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']).editor(
    'Controls-editors/dropdown:EnumStringEditor',
    { options: ['Male', 'Femele'] }
);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.attributes<IPerson>({
    id: null,
    name: StringType,
    gender: GenderType,
    hobbies: ArrayType
      .of(IHobbyType)
      .editor('Controls-editors/dropdown:MultiEnumEditor', {
        options: [
            { value: 0, caption: 'Футбол' },
            { value: 1, caption: 'Бег' },
        ],
      }),
});
