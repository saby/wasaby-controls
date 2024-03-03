import { Meta, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls';
import { INPUT_MODE } from 'Controls/input';

const inputMods = ['default', 'partial'] as const;

export const TDateInputModeType = StringType.oneOf(inputMods)
    .id('Controls/meta:InputMode')
    .title(rk('Режим ввода'))
    .editor(
        () => {
            return import('Controls-editors/dropdown').then(({ EnumStringEditor }) => {
                return EnumStringEditor;
            });
        },
        { options: inputMods }
    ) as Meta<INPUT_MODE>;
