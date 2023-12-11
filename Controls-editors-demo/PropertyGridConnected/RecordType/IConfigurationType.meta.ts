import { ObjectType, StringType, NumberType } from 'Types/meta';

const IConfigurationTypeMeta = ObjectType.id(
    'Controls-editors-demo/PropertyGridConnected/IConfigurationType'
).attributes({
    Caption: StringType.title('Название'),
    Width: NumberType.title('Ширина'),
    Height: NumberType.title('Высота'),
});

export default IConfigurationTypeMeta;
