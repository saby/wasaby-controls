import * as rk from 'i18n!Controls';
import { ObjectType, StringType } from 'Types/meta';
import { TButtonStyle } from 'Controls/buttons';
import { createEditorLoader } from 'Controls-editors/object-type';

const options: readonly TButtonStyle[] = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'unaccented',
    'default',
    'pale',
] as const;

const getDataToRender = () => {
    return { options };
};

export const TButtonStyleType = StringType.id('Controls/meta:TFontColorStyleType')
    .title(rk('Стиль кнопки'))
    .description(rk('Стиль отображения кнопки.'))
    .editor(createEditorLoader('Controls-editors/properties:StyleEditor', getDataToRender));

interface IButtonStyle {
    buttonStyle: string;
    color?: string;
}

export const IButtonStyleType = ObjectType.id('Controls/meta:IButtonStyleType')
    .title(rk('Цвет'))
    .description(rk('Цвет кнопки.'))
    .attributes<IButtonStyle>({
        buttonStyle: TButtonStyleType.defaultValue('secondary'),
        color: TButtonStyleType,
    })
    .editor(createEditorLoader('Controls-editors/properties:StyleObjectEditor', getDataToRender));
