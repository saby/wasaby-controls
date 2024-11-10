import * as React from 'react';
import { Button as DropdownButton } from 'Controls/dropdown';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { Model } from 'Types/entity';
import { IFilterItem } from 'Controls/filter';

interface IFilterAdaptiveConnectedOptions {
    storeId: string;
    filterNames: string[];
}

/**
 * Кнопка фильтра, открывающая меню для быстрого выбора одного одного параметра в режиме адаптива.
 * @public
 * @class Controls-ListEnv/filterAdaptiveConnected:Button
 * @implements Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 * @demo Controls-ListEnv-demo/Filter/Adaptive/Index
 */

function getFilterName(filterNames: string[]): string {
    return filterNames[0];
}

function getFilterItem(
    filterNames: string[],
    filterDescription: IFilterItem[]
): IFilterItem | undefined {
    const filterName = getFilterName(filterNames);
    return filterDescription.find(({ name }) => {
        return name === filterName;
    });
}

export default React.forwardRef(function Button(
    props: IFilterAdaptiveConnectedOptions
): React.ReactElement {
    const { filterDescription, applyFilterDescription } = useFilterDescription(props);
    const filterItem = React.useMemo(() => {
        return getFilterItem(props.filterNames, filterDescription);
    }, [props.filterNames, filterDescription]);
    const editorOptions = filterItem?.editorOptions;
    const dropdownProps = React.useMemo(() => {
        return {
            items: editorOptions?.items,
            keyProperty: editorOptions?.keyProperty,
            displayProperty: editorOptions?.displayProperty,
            menuPopupOptions: {
                allowAdaptive: true,
            },
        };
    }, [filterDescription]);
    const onOnMenuItemActivate = React.useCallback(
        (dropdownItem: Model) => {
            const newFilterDescription = filterDescription.map((item) => {
                const newItem = { ...item };
                if (filterItem?.name === getFilterName(props.filterNames)) {
                    newItem.value = dropdownItem.getKey();
                    newItem.textValue = dropdownItem.get(editorOptions?.displayProperty || 'title');
                }
                return newItem;
            });
            applyFilterDescription(newFilterDescription);
        },
        [filterDescription]
    );
    return (
        <DropdownButton
            {...dropdownProps}
            icon="icon-MenuAk"
            iconStyle="unaccented"
            fontWeight="bold"
            viewMode="link"
            showHeader={false}
            onOnMenuItemActivate={onOnMenuItemActivate}
        />
    );
});
