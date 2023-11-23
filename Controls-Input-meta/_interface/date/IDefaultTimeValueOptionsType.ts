import { NumberType, ObjectType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

export const IDefaultTimeValueOptionsType = ObjectType.id(
    'Controls-Input-meta/dateConnected:IDefaultTimeValueOptionsType'
)
    .attributes({
        defaultValue: NumberType
            .title(translate('Значение'))
            .extended()
            .editor(() => {
                return import('Controls-editors/properties').then(({TimeEditor}) => {
                    return TimeEditor;
                });
            })
            .optional()
            .defaultValue(null)
    })
    .defaultValue({defaultValue: null});
