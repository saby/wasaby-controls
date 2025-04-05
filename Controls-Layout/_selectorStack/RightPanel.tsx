import { ReactElement } from 'react';
import AddButton from './rightPanel/AddButton';
import Toolbar from './rightPanel/Toolbar';
import { useSelectSlice } from 'Controls/selector';
import { IComponentProps } from 'Controls/interface';

export default function RightPanel(props: IComponentProps): ReactElement | null {
    const selectSlice = useSelectSlice();
    const currentTabConfig = selectSlice.state.configs[selectSlice.state.selectedTabKey];
    return (
        <div className={`${props.className} ws-flexbox ws-flex-column`}>
            {currentTabConfig.addButtonConfig ? (
                <AddButton {...currentTabConfig.addButtonConfig} />
            ) : null}
            {currentTabConfig.contentConfig.toolbarConfig ? (
                <Toolbar {...currentTabConfig.contentConfig.toolbarConfig} />
            ) : null}
        </div>
    );
}
