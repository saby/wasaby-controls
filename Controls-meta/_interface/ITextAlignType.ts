import * as rk from 'i18n!Controls';
import { StringType } from 'Meta/types';

const options = ['left', 'right', 'center'] as const;

export const ITextAlignType = StringType.oneOf(options)
    .id('Controls/meta:ITextAlignType')
    .title(rk('Выравнивание текста'))
    // .editor(
    //     () => {
    //         return import('Controls-Input-editors/TextAlignEditor').then(({ TextAlignEditor }) => {
    //             return TextAlignEditor;
    //         });
    //     },
    //     { options }
    // );
