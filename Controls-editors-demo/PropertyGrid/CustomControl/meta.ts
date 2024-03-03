import { StringType, ArrayType, ObjectType } from 'Meta/types';

export interface IPerson {
    name: string;
    hobbies: string[];
}

// Мета-описание интерфейса IHobby
const IHobbyType = StringType;

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.id('CustomEditorMeta')
    .attributes<IPerson>({
        name: StringType.id('Name').title('Имя').defaultValue('Иванов'),
        hobbies: ArrayType.of(IHobbyType).id('Hobby').title('Хобби'),
    })
    .editor('Controls-editors-demo/PropertyGrid/CustomControl/CustomPropertyGrid');
