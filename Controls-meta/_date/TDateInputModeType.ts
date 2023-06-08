import { Meta, StringType } from 'Types/meta';
import * as rk from 'i18n!Controls';
import { INPUT_MODE } from 'Controls/input';

const inputMods = ['default', 'partial'] as const;

export const TDateInputModeType = StringType.oneOf(inputMods)
    .id('Controls/meta:InputMode')
    .title(rk('Режим ввода'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ StringEnumEditor }) => {
                return StringEnumEditor;
            });
        },
        { options: inputMods }
    ) as Meta<INPUT_MODE>;
