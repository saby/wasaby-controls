/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { DataContext, useSlice } from 'Controls-DataEnv/context';
import { TemplateFunction } from 'UICommon/base';

interface IProps {
    contextOptionsInnerComponent: TemplateFunction;
    sliceName?: string;
    contextWrapperRef?: React.Ref<unknown>;
}

function ContextOptionsConsumer(props: IProps): JSX.Element {
    const _dataOptionsValue = React.useContext(DataContext);
    const slice = useSlice(props.sliceName);
    const value = React.useMemo(() => {
        if (slice) {
            return {
                [props.sliceName]: slice,
            };
        } else {
            return _dataOptionsValue;
        }
    }, [slice, _dataOptionsValue]);
    return (
        <props.contextOptionsInnerComponent
            {...props}
            ref={props.contextWrapperRef}
            _dataOptionsValue={value}
        />
    );
}

export default React.memo(ContextOptionsConsumer);
