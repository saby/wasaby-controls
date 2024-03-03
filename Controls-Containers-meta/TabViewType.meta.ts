import { WidgetType } from 'Meta/types';
import { ITabProps } from 'Controls-Containers/interface';
import * as translate from 'i18n!Controls-Containers';

/**
 * Мета-описание вкладка {@link Controls-Containers/Tab:View View}, работающей с контекстом
 */
const TabViewTypeMeta = WidgetType.id('Controls-Containers/Tab:View')
    .title(translate('Вкладка'))
    .description(translate('Элемент вкладки'))
    .category(translate('Контейнеры'))
    .attributes<ITabProps>({
        children: WidgetType.hidden(),
    });

export default TabViewTypeMeta;
