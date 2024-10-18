import { ArrayType, ObjectType, StringType } from 'Meta/types';

export const IValidatorsOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IValidatorsOptionsType'
).properties({
    validators: ArrayType.of(StringType)
        .id('Controls-Input-meta/inputConnected:TValidatorsType')
        .title('Проверка значения')
        .hidden(),
});
