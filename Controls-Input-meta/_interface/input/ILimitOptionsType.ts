import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILimitOptions {
    minValue: number,
    maxValue: number
}

export const ILimitOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:ILabelOptionsType')
    .attributes({
        limit: ObjectType
            .title(translate('Лимит'))
            .attributes<ILimitOptions>({
                minValue: NumberType,
                maxValue: NumberType
            })
            .editor(() => {
                return import('Controls-Input-editors/LimitEditor').then(({LimitEditor}) => {
                    return LimitEditor;
                });
            }, {titlePosition: 'none'})
            .optional()
    });
