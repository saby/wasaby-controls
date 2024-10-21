import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    minValue: number;
    maxValue: number;
}

export const ILimitOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILabelOptionsType'
).properties({
    limit: ObjectType.title(translate('Лимит'))
        .properties<ILimitOptions>({
            minValue: NumberType,
            maxValue: NumberType,
        })
        .editor('Controls-Input-editors/LimitEditor:LimitEditor', { titlePosition: 'none' })
        .optional(),
});
