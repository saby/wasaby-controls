import { WidgetType } from 'Meta/types';
import { ITabProps } from 'Controls-Containers/interface';
import * as translate from 'i18n!Controls-Containers';
import { defaultNavigationStrategy, NavigationRegistrer } from 'FrameEditor/navigation';

/**
 * Мета-описание вкладка {@link Controls-Containers/Tab:View View}, работающей с контекстом
 */
const TabViewTypeMeta = WidgetType.id('Controls-Containers/Tab:View')
    .title(translate('Вкладка'))
    .description(translate('Элемент вкладки'))
    .category(translate('Контейнеры'))
    .properties<ITabProps>({
        children: WidgetType.sampleData(['FrameControls/columnsLayout:Replacer', {}]).hidden(),
    })
    .hidden();

NavigationRegistrer.register(TabViewTypeMeta.getId(), defaultNavigationStrategy);

export default TabViewTypeMeta;
