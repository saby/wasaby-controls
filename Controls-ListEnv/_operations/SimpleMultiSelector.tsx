import { SimpleMultiSelectorRender } from 'Controls/operations';
import { DataContext } from 'Controls-DataEnv/context';
import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import validateSlice from '../Utils/ValidateSlice';
import { IStoreIdOptions } from 'Controls/interface';

export interface ISimpleMultiSelectorConnectedProps extends IStoreIdOptions {
    /**
     * css-класс
     */
    className?: string;
    fontColorStyle?: string;
}

/**
 * Контрол отображающий выпадающий список, который позволяет отмечать все записи, инвертировать, снимать с них отметку.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @public
 * @demo Controls-ListEnv-demo/operations/SimpleMultiSelector/Index
 * @param {ISimpleMultiSelectorConnectedProps} props
 */

function SimpleMultiSelectorConnected(props: ISimpleMultiSelectorConnectedProps): JSX.Element {
    const context = React.useContext(DataContext);
    const slice = context[props.storeId] as ListSlice;
    validateSlice(slice, 'Controls-ListEnv/operations:SimpleMultiSelector');
    const onSelectedTypeChanged = React.useCallback(
        (selectedType: string) => {
            if (selectedType !== 'all' && selectedType !== 'selected') {
                slice.executeCommand(selectedType);
            }
        },
        [slice]
    );
    return (
        <SimpleMultiSelectorRender
            onSelectedTypeChanged={onSelectedTypeChanged}
            selectedKeysCount={slice.state.count}
            selectedKeys={slice.state.selectedKeys}
            isAllSelected={slice.state.isAllSelected}
            excludedKeys={slice.state.excludedKeys}
            loading={slice.state.countLoading}
            className={props.className}
            fontColorStyle={props.fontColorStyle}
        />
    );
}
export default SimpleMultiSelectorConnected;
