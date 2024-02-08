import { ArrayType, NumberType, ObjectType, StringType } from 'Meta/types';
import { IHobby, IPerson } from './interface';

// Мета-описание интерфейса IHobby
const IHobbyType = ObjectType.attributes<IHobby>({
    value: NumberType,
    caption: StringType,
});

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.attributes<IPerson>({
    id: null,
    name: StringType.editor(
        () => {
            return import('./MyEditor').then(({ MyEditor }) => {
                return MyEditor;
            });
        },
        { placeholder: 'Введите текст' }
    ),
    gender: GenderType,
    hobbies: ArrayType.of(IHobbyType),
});
