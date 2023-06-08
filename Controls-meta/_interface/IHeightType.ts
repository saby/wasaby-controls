import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';

const options = [
    'default',
    'xs',
    's',
    'm',
    'l',
    'xl',
    '2xl',
    '3xl',
    '4xl',
] as const;

export const IHeightType = StringType.oneOf(options)
    .id('Controls/meta:IHeightType')
    .title(rk('Размер'))
    .description(rk('Высота контрола.'))
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
