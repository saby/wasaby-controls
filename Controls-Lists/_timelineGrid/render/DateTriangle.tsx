import * as React from 'react';

interface IDateTriangleProps {
    style?: '';
    className?: '';
}

/**
 * Контрол - треугольник линии текущего дня
 * @param props {IDateTriangleProps}
 * @author Крупина К.
 */
export function DateTriangle(props: IDateTriangleProps): React.ReactElement {
    let computedClassName =
        'ControlsLists-dateLine__triangle ControlsLists-dateLine__triangle_border ';
    if (props.className) {
        computedClassName += props.className;
    }

    return <div className={computedClassName} style={props.style} />;
}