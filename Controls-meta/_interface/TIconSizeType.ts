import * as rk from 'i18n!Controls';
import { StringType } from 'Meta/types';
import { TIconSize } from 'Controls/interface';

const options: readonly TIconSize[] = ['default', '2xs', 'xs', 's', 'st', 'm', 'l'] as const;

export const TIconSizeType = StringType.oneOf(options)
    .id('Controls/meta:TIconSizeType')
    .title(rk('Размер иконки'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ SizeEditor }) => {
                return SizeEditor;
            });
        },
        { options }
    );
