import { ObjectType, StringType } from 'Meta/types';
import { IDefaultSNILSValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import extDropdownBooleanType from 'Controls-Input-meta/extDropdownConnectedBooleanType';

const inputBooleanType = ObjectType.id('Controls-Input/DataField/booleanType')
    .title('Логическое')
    .description('Редактор типа "логическое"')
    .icon('icon-TFLocalDrive')
    .properties({
        ...DataField.properties(),
        name: DataField.properties().name.hidden(),
        ...IDefaultSNILSValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/extDrodownConnected:Boolean'),
            componentProps: ObjectType.properties({
                ...extDropdownBooleanType.properties(),
            }),
        }),
    });

export default inputBooleanType;
