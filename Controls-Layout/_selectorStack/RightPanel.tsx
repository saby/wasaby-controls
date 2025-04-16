import { ReactElement } from 'react';
import AddButton from './rightPanel/AddButton';
import Toolbar from './rightPanel/Toolbar';
import { useSelectSlice } from 'Controls/selector';
import { IComponentProps } from 'Controls/interface';

interface IRightPanelProps extends IComponentProps {
    listName: string;
    isAdaptive?: boolean;
}

export default function RightPanel(props: IRightPanelProps): ReactElement | null {
    const selectSlice = useSelectSlice();
    const currentTabConfig = selectSlice.state.configs[props.listName];
    return (
        <div
            className={`${props.className} ws-flexbox ws-flex-column ${
                props.isAdaptive ? '' : 'controls-margin_top-s'
            } `}
        >
            {currentTabConfig.addButtonConfig && !props.isAdaptive ? (
                <AddButton listName={props.listName} {...currentTabConfig.addButtonConfig} />
            ) : null}
            {currentTabConfig.contentConfig.toolbarConfig ? (
                <Toolbar {...currentTabConfig.contentConfig.toolbarConfig} />
            ) : null}
        </div>
    );
}
