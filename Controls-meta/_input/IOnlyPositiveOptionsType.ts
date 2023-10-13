import * as rk from 'i18n!Controls';
import { BooleanType } from 'Types/meta';

const options = [
    { value: false, caption: rk('Все') },
    { value: true, caption: rk('Только положительные') },
];

export const IOnlyPositiveOptionsType = BooleanType.id('Controls/meta:IOnlyPositiveOptionsType')
    .title(rk('Формат'))
    .description(rk('Определяет, будут ли отображаться только неотрицательные числа'))
    .oneOf([false, true])
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ EnumEditor }) => {
                return EnumEditor;
            });
        },
        { options }
    );
