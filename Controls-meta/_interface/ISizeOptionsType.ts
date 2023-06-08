import { ObjectType } from 'Types/meta';
import {
    IHeightOptions,
    IIconSizeOptions,
    IFontSizeOptions,
} from 'Controls/interface';
import { IHeightType } from './IHeightType';
import { TIconSizeType } from './TIconSizeType';
import { TFontSizeType } from './TFontSizeType';
import * as rk from 'i18n!Controls';

interface ISizeOptions
    extends IHeightOptions,
        IIconSizeOptions,
        IFontSizeOptions {}

const options = [
    { caption: 's', value: 's', id: 'm' },
    { caption: 'm', value: 'm', id: 'xl' },
    { caption: 'l', value: 'l', id: '4xl' },
];

export const ISizeOptionsType = ObjectType.id('Controls/meta:ISizeOptionsType')
    .attributes<ISizeOptions>({
        inlineHeight: IHeightType.optional().defaultValue('m'),
        iconSize: TIconSizeType.optional().defaultValue('s'),
        fontSize: TFontSizeType.optional().defaultValue('m'),
    })
    .title(rk('Размеры'))
    .editor(
        () => {
            return import('Controls-editors/properties').then(
                ({ SizeObjectEditor }) => {
                    return SizeObjectEditor;
                }
            );
        },
        { options }
    );
