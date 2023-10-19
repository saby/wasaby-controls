import { ObjectType } from 'Types/meta';
import { IHeightOptions, IIconSizeOptions, IFontSizeOptions } from 'Controls/interface';
import * as rk from 'i18n!Controls';
import { createEditorLoader } from 'Controls-editors/object-type';
import { IHeightType } from './../types/IHeightType';
import { TIconSizeType } from './../types/TIconSizeType';
import { TFontSizeType } from './../types/TFontSizeType';

type ISizeOptions = IHeightOptions & IIconSizeOptions & IFontSizeOptions;

const options = [
    { caption: 's', value: 's', id: 'm' },
    { caption: 'm', value: 'm', id: 'xl' },
    { caption: 'l', value: 'l', id: '4xl' },
];

const getDataToRender = () => {
    return { options };
};

export const ISizeTypeMeta = ObjectType.id('Controls/meta:ISizeOptionsType')
    .attributes<ISizeOptions>({
        inlineHeight: IHeightType.optional().defaultValue('m'),
        iconSize: TIconSizeType.optional().defaultValue('s'),
        fontSize: TFontSizeType.optional().defaultValue('m'),
    })
    .title(rk('Размер'))
    .editor(createEditorLoader('Controls-editors/properties:SizeObjectEditor', getDataToRender));
