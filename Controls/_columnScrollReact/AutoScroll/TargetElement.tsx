import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import { ColumnScrollContext } from '../context/ColumnScrollContext';

export type TTargetElementProps = {
    style?: React.CSSProperties;
    className?: string;
};

function TargetElement(props: TTargetElementProps): JSX.Element {
    const ctx = React.useContext(ColumnScrollContext);

    let className = ctx.SELECTORS.AUTOSCROLL_TARGET;
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <div
            style={props.style}
            data-qa={QA_SELECTORS.AUTOSCROLL_TARGET}
            className={className}
        />
    );
}

export default TargetElement;
