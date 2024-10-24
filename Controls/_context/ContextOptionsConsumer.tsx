/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { DataContext, useSlice, useContextNode } from 'Controls-DataEnv/context';
import { TemplateFunction } from 'UICommon/base';

interface IProps {
    contextOptionsInnerComponent: TemplateFunction;
    sliceName?: string | string[];
    contextWrapperRef?: React.Ref<unknown>;
}

function ContextOptionsConsumer(props: IProps): JSX.Element {
    const _dataOptionsValue = React.useContext(DataContext);
    const contextNode = useContextNode();
    const slice = useSlice(Array.isArray(props.sliceName) ? props.sliceName[0] : props.sliceName);

    const value = React.useMemo(() => {
        if (Array.isArray(props.sliceName) && props.sliceName.length > 1) {
            const slices: Record<string, unknown> = {};
            const contextElements = contextNode?.unsafe__getElementsByTree() || {};
            props.sliceName.forEach((sliceName: string) => {
                slices[sliceName] = contextElements[sliceName];
            });
            return slices;
        } else if (slice) {
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
