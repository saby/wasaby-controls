import { group, WidgetType } from 'Meta/types';
import { ITabsProps } from 'Controls-Containers/interface';
import { TTabsVariantsType } from './_interface/TTabsVariantsType';
import { NavigationRegistrer } from 'FrameEditor/navigation';
import * as translate from 'i18n!Controls-Containers';
import { tabsNavigationStrategy } from 'Controls-Containers-meta/navigation';

/**
 * Мета-описание вкладки {@link Controls-Containers/Tabs Tabs}, работающей с контекстом
 */
const TabsType = WidgetType.id('Controls-Containers/Tabs')
    .title(translate('Вкладки'))
    .icon('icon-TabsWidget')
    .description(
        translate('Виджет, который предоставляет пользователю возможность создания вкладок.')
    )
    .category(translate('Контейнеры'))
    .designtimeEditor('Controls-Containers-meta/TabsDesigntimeEditor')
    .attributes<ITabsProps>({
        ...group('', {
            ...TTabsVariantsType.attributes(),
        }),
    });

const TabsTypeMeta = Object.assign(TabsType, {
    changeHandler: 'Controls-Containers-meta/tabsEditors:changeHandler',
});

NavigationRegistrer.register(TabsTypeMeta.getId(), tabsNavigationStrategy);

export default TabsTypeMeta;
