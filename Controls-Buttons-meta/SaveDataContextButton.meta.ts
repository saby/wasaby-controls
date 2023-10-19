import {
    ICaptionTypeMeta,
    ITooltipTypeMeta,
    IIconOptionsType,
} from 'Controls-Buttons-meta/interface';
import { WidgetType } from 'Types/meta';
import * as rk from 'i18n!Controls';

interface ISaveDataContextButtonOptions {
    caption: string;
    tooltip: string;
}

/**
 * Мета-описание кнопки сохранения контекста {@link Controls-Buttons/SaveDataContextButton SaveDataContextButton}
 */
const saveDataContextButtonTypeMeta = WidgetType.id('Controls-Buttons/SaveDataContextButton')
    .title(rk('Отправить ответ'))
    .description(rk('Кнопка сохраняет содержимое контекста данных'))
    .category(rk('Базовые'))
    .icon('icon-Button')
    .attributes<ISaveDataContextButtonOptions>({
        caption: ICaptionTypeMeta.defaultValue(rk('Отправить ответ')).optional().order(10),
        tooltip: ITooltipTypeMeta.optional().order(20),
        icon: IIconOptionsType.attributes().icon.order(30),
        captionPosition: IIconOptionsType.attributes().captionPosition.order(30),
    });
export default saveDataContextButtonTypeMeta;
