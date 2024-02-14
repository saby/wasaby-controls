import * as React from 'react';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { ControllerClass as OperationsController, Panel } from 'Controls/operations';
import { IActionOptions } from 'Controls/actions';

export interface IOperationsPanelWidgetOptions {
    operationsController?: OperationsController;
    actions?: IActionOptions[];
    storeId?: string;
}

function PanelTemplate(props, ref) {
    return <Panel {...props} ref={props.forwardedRef} />;
}

function OperationsPanelConnected(props, ref) {
    return (
        <ToolbarContainer
            ref={ref}
            permissionsResolver={props.permissionsResolver}
            actions={props.actions}
            storeId={props.storeId}
        >
            <PanelTemplate {...props} />
        </ToolbarContainer>
    );
}

export default React.forwardRef(OperationsPanelConnected);
