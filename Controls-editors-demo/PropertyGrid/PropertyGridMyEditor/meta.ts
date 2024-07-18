import { NumberType, ObjectType, StringType } from 'Meta/types';
import { IPerson } from './interface';

// Мета-описание типа GenderType
const GenderType = StringType.oneOf(['Male', 'Female']);

// Мета-описание интерфейса IPerson
export const IPersonType = ObjectType.attributes<IPerson>({
    name: StringType.editor(
        'Controls-editors-demo/PropertyGrid/PropertyGridMyEditor/MyEditor:MyEditor',
        { placeholder: 'Введите текст' }
    ),
    age: NumberType,
    gender: GenderType,
});
