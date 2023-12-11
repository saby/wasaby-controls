import * as rk from 'i18n!Controls';
import { NumberType } from 'Types/meta';

const options = {
    afterInputText: rk('строки'),
    minValue: 1,
    maxValue: 10,
};

export const ILengthStringType = NumberType.id('Controls/meta:ILengthStringType');
//   .editor(
//     () => {
//         return import('Controls-editors/properties').then(({ NumberMinMaxEditor }) => {
//             return NumberMinMaxEditor;
//         });
//     },
//     { options }
// );
