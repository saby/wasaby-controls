import { ObjectType, StringType } from 'Meta/types';
import { IDefaultIPValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import extInputConnectedIPType from 'Controls-Input-meta/extInputConnectedIPType';

const inputIPType = ObjectType.id('Controls-Input/DataField/inputIPType')
    .title('IP адрес')
    .description('Редактор типа "IP адрес"')
    .icon('icon-TFLocalDrive')
    .properties({
        ...DataField.properties(),
        ...IDefaultIPValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/extInputConnected:IP'),
            componentProps: ObjectType.properties({
                ...extInputConnectedIPType.properties(),
            }),
        }),
    });

export default inputIPType;
