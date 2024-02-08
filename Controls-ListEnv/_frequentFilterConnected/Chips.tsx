/**
 * @kaizen_zone 791267ec-c189-4684-9985-befef0ad3120
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IToggleFilterProps, useToggleFilter } from './Toggle/useToggleFilter';

/**
 * Контрол - "Переключатель фильтра".
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/Chips:Control}.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/frequentFilterConnected:Chips
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 * @extends Controls/Chips:Control
 * @ignoreOptions items selectedKeys allowEmptySelection
 *
 * @demo Controls-ListEnv-demo/FrequentFilter/Chips/Index
 * @see Controls/filter:View
 */
function FrequentFilterChips(props: IToggleFilterProps) {
    const { toggleItem, applyToggleFilterItem } = useToggleFilter(props);
    const multiSelect = toggleItem.editorOptions.multiSelect ?? false;
    const handleSelectionChanged = React.useCallback(
        (event: Event, value: number[] | string[]) => {
            applyToggleFilterItem(multiSelect ? value : [value[0]]);
        },
        [applyToggleFilterItem]
    );

    const templateOptions = React.useMemo(() => {
        return {
            ...toggleItem.editorOptions,
            onSelectedKeysChanged: handleSelectionChanged,
            selectedKeys: multiSelect ? toggleItem.value : [toggleItem.value[0]],
        };
    }, [toggleItem]);

    return (
        <Async
            attrs={props.attrs}
            templateName="Controls/Chips:Control"
            templateOptions={templateOptions}
        ></Async>
    );
}

/**
 * @name Controls-ListEnv/frequentFilterConnected:Chips#multiSelect
 * @cfg {Boolean} Устанавливает режим множественного выбора элементов фильтра.
 * @default true
 * @variant true Режим множественного выбора элементов филтра установлен.
 * @variant false Режим множественного выбора элементов фильтра отменен.
 */

export default React.forwardRef(FrequentFilterChips);
