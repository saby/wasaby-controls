import * as rk from 'i18n!Controls';
import { StringType } from 'Types/meta';
import { Button } from 'Controls/buttons';

const options = {
    control: Button,
    controlOptions: {
        caption: 'Кнопка',
    },
    viewModes: [
        {
            key: 'outlined',
            caption: 'Контурная',
        },
        {
            key: 'filled',
            caption: 'Залитая',
        },
        {
            key: 'linkButton',
            caption: 'Кнопка-ссылка',
        },
        {
            key: 'ghost',
            caption: 'Кнопка с заливкой по ховеру',
        },
    ],
};

export const IViewModeType = StringType.oneOf(['link', 'ghost', 'filled', 'outlined'])
    .id('Controls/meta:Button.IViewModeType')
    .title(rk('Вид кнопки'))
    .defaultValue('outlined')
    .editor(
        () => {
            return import('Controls-Buttons-editors/ViewModeEditor').then(({ ViewModeEditor }) => {
                return ViewModeEditor;
            });
        },
        { options }
    );
