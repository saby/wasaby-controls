import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = ['left', 'right', 'center'] as const;

export const ITextAlignType = StringType.oneOf(options)
    .id('Controls/meta:ITextAlignType')
    .title(rk('Выравнивание текста'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ TextAlignEditor }) => {
                return TextAlignEditor;
            });
        },
        { options }
    );
