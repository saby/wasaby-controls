import { SimpleMultiSelectorRender } from 'Controls/operations';
import { useSlice } from 'Controls-DataEnv/context';
import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import validateSlice from '../Utils/ValidateSlice';
import { IStoreIdOptions } from 'Controls/interface';
import useCount from './useCount';

export interface ISimpleMultiSelectorConnectedProps extends IStoreIdOptions {
    /**
     * css-класс
     */
    className?: string;
    fontColorStyle?: string;
}

/**
 * Контрол отображающий выпадающий список, который позволяет отмечать все записи, инвертировать, снимать с них отметку.
 * @class Controls-ListEnv/_operationsConnected/SimpleMultiSelector
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @public
 * @demo Controls-ListEnv-demo/OperationsConnected/SimpleMultiSelector/Index
 * @param {ISimpleMultiSelectorConnectedProps} props
 */

function SimpleMultiSelectorConnected(props: ISimpleMultiSelectorConnectedProps): JSX.Element {
    const slice = useSlice<ListSlice>(props.storeId);
    validateSlice(slice, 'Controls-ListEnv/operations:SimpleMultiSelector');
    const count = useCount(slice);
    const onSelectedTypeChanged = React.useCallback(
        (selectedType: string) => {
            if (selectedType === 'all' || selectedType === 'selected') {
                slice?.setSelectionViewMode(selectedType);
            }
            slice.executeCommand(selectedType);
        },
        [slice]
    );
    return (
        <SimpleMultiSelectorRender
            onSelectedTypeChanged={onSelectedTypeChanged}
            selectedKeysCount={count}
            showSelectedCount={slice.state.showSelectedCount}
            selectedKeys={slice.state.selectedKeys}
            isAllSelected={slice.state.isAllSelected}
            excludedKeys={slice.state.excludedKeys}
            loading={slice.state.countLoading}
            selectionViewMode={slice.state.selectionViewMode}
            className={props.className}
            fontColorStyle={props.fontColorStyle}
        />
    );
}

export default SimpleMultiSelectorConnected;
