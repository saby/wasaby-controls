import { BooleanType } from 'Meta/types';
import * as rk from 'i18n!Controls';

export const IRequiredOptionsType = BooleanType.id('Controls/meta:IRequiredOptionsType')
    .description(rk('Определяет, обязательность для заполнения.'))
    .title('Поле обязательно для заполнения')
    .editor(() => {
        return import('Controls-editors/CheckboxEditor').then(({ CheckboxEditor }) => {
            return CheckboxEditor;
        });
    }, {});
