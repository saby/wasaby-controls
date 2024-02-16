/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';

interface ICurrentDateLine {
    style?: '';
    className?: '';
}

/**
 * Линия текущего дня
 */
export function DateLine(props: ICurrentDateLine): React.ReactElement {
    let computedClassName = 'ControlsLists-dateLine__line ';
    if (props.className) {
        computedClassName += props.className;
    }
    return <div className={computedClassName} style={props.style} />;
}
