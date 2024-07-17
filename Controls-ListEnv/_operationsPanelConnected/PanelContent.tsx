import * as React from 'react';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { ControllerClass as OperationsController, Panel } from 'Controls/operations';
import { IActionOptions } from 'Controls/actions';
import {
    IFontColorStyleOptions,
    IIconStyleOptions,
    IIconSizeOptions,
    TBackgroundStyle,
} from 'Controls/interface';

export interface IOperationsPanelWidgetOptions
    extends IFontColorStyleOptions,
        IIconStyleOptions,
        IIconSizeOptions {
    operationsController?: OperationsController;
    actions?: IActionOptions[];
    storeId?: string;
    menuBackgroundStyle?: TBackgroundStyle;
    menuIcon?: string;
    menuHoverBackgroundStyle?: TBackgroundStyle;
    closeButtonVisible?: boolean;
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
            changeShowTypeInAdaptive={false}
        >
            <PanelTemplate {...props} />
        </ToolbarContainer>
    );
}

export default React.forwardRef(OperationsPanelConnected);
