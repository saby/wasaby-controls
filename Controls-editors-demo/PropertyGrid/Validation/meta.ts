import { ObjectType, StringType, BooleanType, NumberType, ArrayType } from 'Meta/types';
import { JobType } from 'Controls-editors-demo/PropertyGrid/editors/VariantEditor/meta';

const columns = [
    {
        displayProperty: 'name',
        width: '100px',
    },
    {
        displayProperty: 'type',
        width: '100px',
    },
    {
        displayProperty: 'comment',
        width: '200px',
    },
    {
        displayProperty: 'unique',
        width: '50px',
    },
];

export const RecordType = ObjectType.properties({
    name: StringType,
    type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
        .editor('Controls-editors/dropdown:EnumStringEditor', {
            options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
        })
        .defaultValue('Auto'),
    comment: StringType,
    unique: BooleanType.defaultValue(true),
});

export const PersonType = ObjectType.properties({
    name: StringType.title('Имя').order(1).optional().description('Имя'),
    surname: StringType.title('Фамилия').order(2).optional(),
    age: NumberType.title('Возраст').optional(),
    height: NumberType.title('Рост').optional(),
    interest: StringType.title('Интересы').optional(),
    job: JobType,
    skills: ObjectType.properties({
        stress: BooleanType.title('Стрессоустойчивость')
            .optional()
            .order(1)
            .description('Стрессоустойчивость'),
        communicative: BooleanType.title('Коммуникабельность')
            .optional()
            .order(2)
            .description('Коммуникабельность'),
    })
        .title('Навыки')
        .order(4)
        .optional(),
    table: ArrayType.of(RecordType).title('Список на RecordSet').editorProps({ columns }),
})
    .complexEditors([
        {
            name: 'Controls-editors-demo/PropertyGrid/editors/ComplexEditor/Editor',
            properties: ['name', 'surname'],
        },
    ])
    .title('Персона');
