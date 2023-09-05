import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';
import { createEditorLoader } from 'Controls-editors/object-type';

const buttonViewModes = [
    {
        value: 'outlined',
        caption: rk('Контурный'),
    },
    {
        value: 'filled',
        caption: rk('Залитый'),
    },
    {
        value: 'link',
        caption: rk('Кнопка-ссылка'),
    },
    {
        value: 'ghost',
        caption: rk('С заливкой по ховеру'),
    },
];

const getDataToRender = () => {
    return { options: buttonViewModes };
};

export const IViewModeType = StringType.oneOf(['link', 'ghost', 'filled', 'outlined'])
    .id('Controls-Buttons/button:IViewModeType')
    .title(rk('Тип отображения'))
    .defaultValue('outlined')
    .editor(createEditorLoader('Controls-editors/properties:EnumEditor', getDataToRender));
