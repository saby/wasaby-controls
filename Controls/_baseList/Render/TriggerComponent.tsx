import * as React from 'react';
import { Trigger } from 'Controls/display';

interface ITriggerProps {
    trigger: Trigger;
    orientation?: 'vertical' | 'horizontal';
    className?: string;
}

function TriggerComponent(
    props: ITriggerProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { trigger, orientation = 'vertical' } = props;

    const className =
        orientation === 'vertical'
            ? 'controls-BaseControl__loadingTrigger'
            : 'controls-BaseControl__loadingTrigger_horizontal';

    const dataQa = `${trigger.listElementName}-${trigger.getPosition()}`;

    return (
        <div
            ref={ref}
            className={props.className + ' ' + className}
            data-qa={dataQa}
        />
    );
}

export default React.memo(React.forwardRef(TriggerComponent));
