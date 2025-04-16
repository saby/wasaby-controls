import { Ref, forwardRef, ReactElement } from 'react';
import { ISelectorTabConfig } from 'Controls/selector';
import { AddButton } from 'ExtControls/dropdown';
import { View, IToolbarOptions } from 'Controls/toolbars';
import { Container } from 'Controls-ListEnv/toolbarConnected';

function ToolbarView(props: IToolbarOptions): JSX.Element {
    return <View direction="vertical" {...props} />;
}

const Toolbar = forwardRef(
    (
        props: Required<ISelectorTabConfig>['contentConfig']['toolbarConfig'],
        ref: Ref<AddButton>
    ): ReactElement | null => {
        return <Container {...props} ref={ref} content={ToolbarView} />;
    }
);

export default Toolbar;
