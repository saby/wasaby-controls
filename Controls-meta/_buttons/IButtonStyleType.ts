import * as rk from 'i18n!Controls';
import { ObjectType, StringType } from 'Types/meta';
import { TButtonStyle } from 'Controls/buttons';

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

export const TButtonStyleType = StringType.id('Controls/meta:TFontColorStyleType')
    .title(rk('Стиль кнопки'))
    .description(rk('Стиль отображения кнопки.'))
    .editor(
        () => {
            return import('Controls-Buttons-editors/StyleEditor').then(({ StyleEditor }) => {
                return StyleEditor;
            });
        },
        { options }
    );

interface IButtonStyle {
    buttonStyle: string;
    color?: string;
}

export const IButtonStyleType = ObjectType.id('Controls/meta:IButtonStyleType')
    .title(rk('Цвет'))
    .description(rk('Стиль отображения кнопки.'))
    .attributes<IButtonStyle>({
        buttonStyle: TButtonStyleType.defaultValue('secondary'),
        color: TButtonStyleType,
    })
    .editor(
        () => {
            return import('Controls-Buttons-editors/StyleEditor').then(({ StyleObjectEditor }) => {
                return StyleObjectEditor;
            });
        },
        { options }
    );
