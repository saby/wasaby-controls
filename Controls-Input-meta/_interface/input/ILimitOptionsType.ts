import { NumberType, ObjectType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

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
        return import('Controls-Input-editors/LimitEditor').then(({ LimitEditor }) => {
            return LimitEditor;
        });
    }, {titlePosition: 'none'})
    .optional();
