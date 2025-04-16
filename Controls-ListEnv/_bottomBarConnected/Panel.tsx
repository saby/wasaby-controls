import { View } from 'Controls-ListEnv/operationsPanelConnected';
import { View as BaseView, IBottomBarBaseProps } from 'Controls-ListEnv/bottomBar';
import { useSlice } from 'Controls-DataEnv/context';
import type { ListSlice } from 'Controls/dataFactory';
import * as React from 'react';

interface IBottomBarConnectedProps
    extends Omit<IBottomBarBaseProps, 'children' & 'onExpandedChanged'> {
    storeId: string;
}

export default function BottomBarConnected(props: IBottomBarConnectedProps): JSX.Element {
    const listSlice = useSlice<ListSlice>(props.storeId);

    if (!listSlice) {
        throw new Error(
            `BottomBarConnected::Не найден слайс в контексте по ключу ${props.storeId}`
        );
    } else {
        const onExpandedChanged = React.useCallback((newExpanded: boolean) => {
            listSlice.setState({
                operationsPanelVisible: newExpanded,
            });
        }, []);

        return (
            <BaseView
                className={props.className}
                rightTemplate={props.rightTemplate}
                beforeExpanderTemplate={props.beforeExpanderTemplate}
                expanded={listSlice.state.operationsPanelVisible}
                onExpandedChanged={onExpandedChanged}
                readOnly={props.readOnly}
            >
                <View
                    storeId={props.storeId}
                    readOnly={props.readOnly}
                    fontColorStyle={'secondary'}
                    iconStyle={'label'}
                    iconSize={'m'}
                    menuBackgroundStyle={'default'}
                    menuIcon={'icon-SettingsNew'}
                    menuHoverBackgroundStyle={'icon-SettingsNew'}
                    closeButtonVisible={false}
                />
            </BaseView>
        );
    }
}
