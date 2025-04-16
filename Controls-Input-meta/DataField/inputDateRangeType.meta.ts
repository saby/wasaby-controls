import { ObjectType, StringType } from 'Meta/types';
import { IDefaultRangeValueOptionsType } from 'Controls-Input-meta/interface';
// @ts-ignore
import DataField from './IDataFieldType';
// @ts-ignore
import dateRangeConnectedInputType from 'Controls-Input-meta/dateRangeConnectedInputType';

const inputDateRangeType = ObjectType.id('Controls-Input/DataField/inputDateRangeType')
    .title('Период')
    .description('Редактор типа "период"')
    .icon('icon-ConnectionPeriod')
    .properties({
        ...DataField.properties(),
        ...IDefaultRangeValueOptionsType.properties(),
        editor: ObjectType.properties({
            component: StringType.defaultValue('Controls-Input/dateRangeConnected:Input'),
            componentProps: ObjectType.properties({
                ...dateRangeConnectedInputType.properties(),
            }),
        }),
    });

export default inputDateRangeType;
