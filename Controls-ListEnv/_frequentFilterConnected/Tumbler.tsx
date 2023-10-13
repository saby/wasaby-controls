/**
 * @kaizen_zone 6146d5da-db9b-42cf-919c-2bb056612f1e
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';
import { useToggleFilter } from './Toggle/useToggleFilter';

const customEvents = ['onSelectedKeyChanged'];

/**
 * Контрол - "Переключатель фильтра".
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/Tumbler:Control}.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/frequentFilterConnected:Tumbler
 * @extends UI/Base:Control
 *
 * @mixes Controls/interface:IItems
 * @mixes Controls/interface:IHeight
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 * @mixes Controls/interface:IStoreId
 *
 * @demo Controls-ListEnv-demo/FrequentFilter/Tumbler/Index
 * @see Controls/filter:View
 */
function FrequentFilterTumbler(props: IInnerWidgetOptions, ref) {
    const { toggleItem, applyToggleFilterItem } = useToggleFilter(props);

    const templateOptions = React.useMemo(() => {
        const editorOptions = toggleItem.editorOptions;
        return {
            items: editorOptions.items || props.items,
            itemTemplate: editorOptions.itemTemplate || props.itemTemplate,
            keyProperty: editorOptions.keyProperty || props.keyProperty,
            displayProperty: editorOptions.displayProperty || props.displayProperty,
            disableAnimation: true,
            selectedKey: toggleItem.value,
        };
    }, [toggleItem, props.items, props.itemTemplate, props.keyProperty, props.displayProperty]);

    const handleSelectionChanged = React.useCallback(
        (value: number[] | string[]) => {
            applyToggleFilterItem(value);
        },
        [applyToggleFilterItem]
    );

    return (
        <Async
            ref={ref}
            attrs={props.attrs}
            templateName="Controls/Tumbler:Control"
            templateOptions={templateOptions}
            onSelectedKeyChanged={handleSelectionChanged}
            customEvents={customEvents}
        ></Async>
    );
}

export default React.forwardRef(FrequentFilterTumbler);

/**
 * @name Controls-ListEnv/_frequentFilterConnected/Tumbler#direction
 * @cfg {string} Расположение элементов в контейнере.
 * @variant horizontal Элементы расположены один за другим (горизонтально).
 * @variant vertical Элементы расположены один под другим (вертикально).
 * @default horizontal
 * @example
 * Вертикальная ориентация.
 * <pre>
 *    <Controls-ListEnv.frequentFilterConnected:Tumbler direction="vertical"/>
 * </pre>
 */

/**
 * @name Controls-ListEnv/_frequentFilterConnected/Tumbler#itemTemplate
 * @cfg {TemplateFunction|String} Шаблон элемента виджета "Переключатель фильтра".
 * По умолчанию используется шаблон {@link Controls/Tumbler:ItemTemplate}.
 */
