import { group, StringType, WidgetType } from 'Meta/types';
import { ITabsProps } from 'Controls-Containers/interface';
import { TTabsVariantsType } from './_interface/TTabsVariantsType';
import { NavigationRegistrer } from 'FrameEditor/navigation';
import * as translate from 'i18n!Controls-Containers';
import { tabsNavigationStrategy } from 'Controls-Containers-meta/navigation';
import { RUNTIME_WIDGET_NAMES } from 'FrameEditorConverter/constants';
import { IViewModeOptionsType } from './_interface/IViewModeOptionsType';
import { IControlProps } from 'Controls/interface';

const SAMPLE_TEXT_CHILD = Object.freeze([
    RUNTIME_WIDGET_NAMES.formatted,
    { formats: [[0, 0, {}]] },
]);

const SAMPLE_PARAGRAPH_CHILD = Object.freeze([
    RUNTIME_WIDGET_NAMES.paragraph,
    { textStyle: 'default' },
    [...SAMPLE_TEXT_CHILD],
]);

const SAMPLE_LAYOUT_CHILD = Object.freeze([
    RUNTIME_WIDGET_NAMES.layout,
    [...SAMPLE_PARAGRAPH_CHILD],
]);

const SAMPLE_TAB_CHILD = Object.freeze([
    'Controls-Containers/Tab:View',
    { selectable: false },
    [...SAMPLE_LAYOUT_CHILD],
]);

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
    .properties<Required<Omit<ITabsProps, '.style' | keyof IControlProps>>>({
        ...group('', {
            ...TTabsVariantsType.properties(),
            children: WidgetType.sampleData([[...SAMPLE_TAB_CHILD]]).hidden(),
            viewMode: StringType.oneOf(['underlined', 'bordered']).hidden(),
        }),
    })
    .appendStyles({
        ...IViewModeOptionsType.properties(),
    })
    .isValueConvertable('Controls-Containers-meta/isNonConvertable');

const TabsTypeMeta = Object.assign(TabsType, {
    changeHandler: 'Controls-Containers-meta/tabsEditors:changeHandler',
});

NavigationRegistrer.register(TabsTypeMeta.getId(), tabsNavigationStrategy);

export default TabsTypeMeta;
