import * as rk from 'i18n!Controls';
import { NumberType, ObjectType } from 'Types/meta';
import { INumberLengthOptions } from 'Controls/input';

const options = {
    afterInputText: rk('знака'),
};

export const INumberLengthOptionsType = ObjectType.id(
    'Controls/meta:INumberLengthOptionsType'
).attributes<INumberLengthOptions>({
    integersLength: NumberType.title('Ограничивать'),
    //   .editor(
    //     () => {
    //         return import('Controls-Input-editors/LengthEditor').then(({ LengthEditor }) => {
    //             return LengthEditor;
    //         });
    //     },
    //     {
    //         options: {
    //             ...options,
    //             captionCheckBox: rk('Целую часть'),
    //         },
    //     }
    // ),
    precision: NumberType.title(' ')
    //   .editor(
    //     () => {
    //         return import('Controls-Input-editors/LengthEditor').then(({ LengthEditor }) => {
    //             return LengthEditor;
    //         });
    //     },
    //     {
    //         options: {
    //             ...options,
    //             captionCheckBox: rk('Дробную часть'),
    //         },
    //     }
    // ),
});
