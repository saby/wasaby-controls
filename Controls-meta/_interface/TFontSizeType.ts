import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = [
    'inherit',
    'xs',
    's',
    'm',
    'l',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
    '6xl',
    '7xl',
    '8xl',
] as const;

export const TFontSizeType = StringType.oneOf(options)
    .id('Controls/meta:TFontSizeType')
    .title(rk('Размер шрифта'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ SizeEditor }) => {
                    return SizeEditor;
                }
            );
        },
        { options }
    );
