import { MultiSelectorCheckbox } from 'Controls/operations';
import { useSlice } from 'Controls-DataEnv/context';
import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import { IStoreIdOptions } from 'Controls/interface';
import validateSlice from '../Utils/ValidateSlice';
import useCount from './useCount';

export interface IMultiSelectorCheckboxConnectedProps extends IStoreIdOptions {
    /**
     * css-класс
     */
    className?: string;
}

/**
 * Контрол, который отображает чекбокс, позволяющий произвести массовую отметку записей в списке.
 * @class Controls-ListEnv/_operationsConnected/Checkbox
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @public
 * @demo Controls-ListEnv-demo/OperationsConnected/MultiSelectorCheckbox/Index
 * @param {IMultiSelectorCheckboxConnectedProps} props
 */
function MultiSelectorCheckboxConnected(props: IMultiSelectorCheckboxConnectedProps): JSX.Element {
    const slice = useSlice<ListSlice>(props.storeId);
    validateSlice(slice, 'Controls-ListEnv/operations:MultiSelectorCheckbox');
    const count = useCount(slice);
    const onSelectedTypeChanged = React.useCallback(
        (selectedType: string) => {
            if (selectedType !== 'all' && selectedType !== 'selected') {
                slice.executeCommand(selectedType);
            }
        },
        [slice]
    );
    return (
        <MultiSelectorCheckbox
            onSelectedTypeChanged={onSelectedTypeChanged}
            selectedKeysCount={slice.state.count}
            selectedKeys={slice.state.selectedKeys}
            isAllSelected={slice.state.isAllSelected}
        />
    );
}

export default MultiSelectorCheckboxConnected;
