import { ObjectType, StringType } from 'Meta/types';
import { IDefaultValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import inputConnectedTextType from 'Controls-Input-meta/inputConnectedTextType';

const inputTextType = ObjectType.id('Controls-Input/DataField/inputTextType')
    .title('Текст')
    .description('Редактор типа "текст"')
    .icon('icon-Rename')
    .properties({
        ...DataField.properties(),
        ...IDefaultValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/inputConnected:Text'),
            componentProps: ObjectType.properties({
                ...inputConnectedTextType.properties(),
            }),
        }),
    });

export default inputTextType;
