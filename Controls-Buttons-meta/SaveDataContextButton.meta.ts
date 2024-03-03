import { ICaptionTypeMeta, IIconType, ITooltipTypeMeta } from 'Controls-Input-meta/interface';
import { WidgetType } from 'Meta/types';
import * as rk from 'i18n!Controls-Buttons';

interface ISaveDataContextButtonOptions {
    caption: string;
    tooltip: string;
    icon: string;
    captionPosition: 'start' | 'end';
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
        icon: IIconType.attributes().uri.order(30),
        captionPosition: IIconType.attributes().captionPosition.order(30),
    });
export default saveDataContextButtonTypeMeta;
