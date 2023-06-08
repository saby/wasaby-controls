import { ICaptionOptionsType, ITooltipOptionsType } from 'Controls-meta/controls';
import { group, WidgetType } from 'Types/meta';
import * as translate from 'i18n!Controls';
import { IViewModeType } from './_interface/IViewModeType';
import { IButtonStyleType } from './_interface/IButtonStyleType';
import { ISizeType } from './_interface/ISizeType';
import type { IViewMode } from 'Controls/buttons';

interface ISaveDataContextButtonOptions {
    caption: string;
    tooltip: string;
    viewMode: IViewMode;
}
/**
 * Мета-описание кнопки "Отправить ответ" {@link Controls-Button/SaveDataContextButton SaveDataContextButton}
 */
const saveDataContextButtonTypeMeta = WidgetType.id('Controls-Buttons/SaveDataContextButton')
    .title(translate('Отправить ответ'))
    .category(translate('Базовые'))
    .attributes<ISaveDataContextButtonOptions>({
        caption: ICaptionOptionsType.attributes().caption.defaultValue(
            translate('Отправить ответ')
        ),
        tooltip: ITooltipOptionsType.attributes().tooltip,
        ...group(translate('Стиль'), {
            viewMode: IViewModeType.optional(),
            ...IButtonStyleType.attributes(),
            ...ISizeType.attributes(),
        }),
    });

export default saveDataContextButtonTypeMeta;
