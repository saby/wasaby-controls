import { ObjectType, NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls';

interface ILimitOptions {
    minValue: number,
    maxValue: number
}

export const ILimitOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:ILabelOptionsType')
    .attributes<ILimitOptions>({
        minValue: NumberType,
        maxValue: NumberType
    })
    .title(translate('Лимит'))
    .editor(() => {
        return import('Controls-editors/properties').then(({LimitEditor}) => {
            return LimitEditor;
        });
    })
    .optional();
