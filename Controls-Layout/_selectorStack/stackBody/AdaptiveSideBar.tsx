import { Ref, forwardRef } from 'react';
import { SimpleMultiSelector } from 'Controls-ListEnv/operationsConnected';
import { IFilterConfig, useSelectSlice } from 'Controls/selector';
import AddButton from '../rightPanel/AddButton';
import SubmitButton from '../stackHeader/SubmitButton';
import 'css!Controls-Layout/selectorStack';

interface IAdaptiveSideBar extends IFilterConfig {
    listName: string;
}

export const AdaptiveSideBar = forwardRef(
    (props: IAdaptiveSideBar, ref: Ref<HTMLDivElement>): JSX.Element | null => {
        const selectSlice = useSelectSlice();
        const tabConfig = selectSlice.state.configs[props.listName];
        const checkboxVisible =
            selectSlice.state.multiSelect && Object.keys(selectSlice.state.configs).length === 1;
        return (
            <div className={'controls-Layout-SelectorStack__adaptiveSideBar'}>
                {checkboxVisible && (
                    <SimpleMultiSelector
                        storeId={tabConfig.storeId}
                        className={
                            'controls-Layout-SelectorStack__multiSelector controls-Layout-SelectorStack__adaptiveButton'
                        }
                    />
                )}
                {tabConfig.addButtonConfig ? (
                    <AddButton
                        {...tabConfig.addButtonConfig}
                        isAdaptive={true}
                        className={'controls-margin_right-st'}
                    />
                ) : null}
                <SubmitButton isAdaptive={true} />
            </div>
        );
    }
);
