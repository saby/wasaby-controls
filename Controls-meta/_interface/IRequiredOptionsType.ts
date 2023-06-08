import { BooleanType } from 'Types/meta';
import * as rk from 'i18n!Controls';

export const IRequiredOptionsType = BooleanType.id('Controls/meta:IRequiredOptionsType')
    .description(rk('Определяет, обязательность для заполнения.'))
    .title('Поле обязательно для заполнения')
    .editor(() => {
        return import('Controls-editors/properties').then(({ BooleanEditorCheckbox }) => {
            return BooleanEditorCheckbox;
        });
    }, {});
