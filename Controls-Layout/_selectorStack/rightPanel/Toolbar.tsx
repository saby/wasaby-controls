import { Ref, forwardRef, ReactElement } from 'react';
import { ISelectorTabConfig } from 'Controls/selector';
import { AddButton } from 'ExtControls/dropdown';
import { View } from 'Controls/toolbars';
import { Container } from 'Controls-ListEnv/toolbarConnected';

const Toolbar = forwardRef(
    (
        props: Required<ISelectorTabConfig>['contentConfig']['toolbarConfig'],
        ref: Ref<AddButton>
    ): ReactElement | null => {
        return (
            <Container {...props} ref={ref}>
                <View direction="vertical" />
            </Container>
        );
    }
);

export default Toolbar;
