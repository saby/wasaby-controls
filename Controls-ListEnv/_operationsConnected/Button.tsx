import { Button } from 'Controls/operations';
import { useSlice } from 'Controls-DataEnv/context';
import * as React from 'react';
import { ListSlice } from 'Controls/dataFactory';
import { IStoreIdOptions } from 'Controls/interface';
import validateSlice from '../Utils/ValidateSlice';
import { IButtonOptions } from 'Controls/buttons';
import { useReadonly } from 'UICore/Jsx';

/**
 * Интерфейс опций OperationsButton
 * @public
 */

export interface IOperationsButtonConnectedProps extends IStoreIdOptions {
    iconSize?: IButtonOptions['iconSize'];
    viewMode?: IButtonOptions['viewMode'];
    inlineHeight?: IButtonOptions['inlineHeight'];
    /**
     * css-класс
     */
    className?: string;
}

/**
 * Контрол-кнопка, использующийся для показа и скрытия панели действий {@link Controls-ListEnv/operationsPanel:Panel}.
 *
 * @class Controls-ListEnv/_operationsConnected/Button
 * @param {IOperationsButtonConnectedProps} props Опции кнопки
 * @demo Controls-ListEnv-demo/OperationsConnected/Button/Index
 * @public
 *
 */

function OperationsButtonConnected(props: IOperationsButtonConnectedProps): JSX.Element {
    const slice = useSlice<ListSlice>(props.storeId);

    validateSlice(slice, 'Controls-ListEnv/operations:Button');
    const onExpandedChanged = React.useCallback(
        (e: React.MouseEventHandler, expanded: boolean) => {
            if (expanded) {
                slice.openOperationsPanel();
            } else {
                slice.closeOperationsPanel();
            }
        },
        [slice]
    );

    const readOnly = useReadonly(props);

    return (
        <Button
            expanded={slice.state.operationsPanelVisible}
            onExpandedChanged={onExpandedChanged}
            iconSize={props.iconSize}
            viewMode={props.viewMode}
            inlineHeight={props.inlineHeight}
            className={props.className}
            readOnly={readOnly}
        />
    );
}

export default OperationsButtonConnected;
