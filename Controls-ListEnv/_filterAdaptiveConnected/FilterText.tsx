import * as React from 'react';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';

interface IFilterAdaptiveConnectedOptions {
    storeId: string;
    filterNames: string[];
}

/**
 * Строка, отображающая выбранный параметр фильтра в адаптиве.
 * @public
 * @class Controls-ListEnv/filterAdaptiveConnected:FilterText
 * @implements Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 * @demo Controls-ListEnv-demo/Filter/Adaptive/Index
 */

function isItemChanged(item: IFilterItem): boolean {
    return !isEqual(
        object.getPropertyValue(item, 'value'),
        object.getPropertyValue(item, 'resetValue')
    );
}

function getFilterText(filterDescription: IFilterItem[]): string {
    const textArr: string[] = [];
    filterDescription.map((item) => {
        if (item.textValue && isItemChanged(item)) {
            textArr.push(item.textValue);
        }
    });
    return textArr.join(', ');
}

export default React.forwardRef(function FilterText(
    props: IFilterAdaptiveConnectedOptions
): React.ReactElement {
    const { filterDescription } = useFilterDescription(props);
    const textValue = React.useMemo(() => {
        return getFilterText(filterDescription);
    }, [filterDescription]);
    return (
        <div className="controls-FilterAdaptive__filterText controls-text-secondary">
            {textValue}
        </div>
    );
});
