import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { QA_SELECTORS } from '../common/data-qa';

export interface IWidthsDependentStylesComponentProps {
    selectors: ISelectorsState;
    fixedWidth: number;
    viewPortWidth: number;
}

/**
 * @private
 * @pure
 */
export function WidthsDependentStylesComponent(
    props: IWidthsDependentStylesComponentProps
): React.FunctionComponentElement<IWidthsDependentStylesComponentProps> {
    return (
        <style data-qa={QA_SELECTORS.WIDTH_STYLES_TAG}>
            {`.${props.selectors.FIXED_TO_LEFT_EDGE_ELEMENT} { left: ${props.fixedWidth}px; }`}
            {`.${props.selectors.STRETCHED_TO_VIEWPORT_ELEMENT} { width: ${props.viewPortWidth}px; }`}
        </style>
    );
}

export const WidthsDependentStylesComponentMemo = React.memo(WidthsDependentStylesComponent);
export default WidthsDependentStylesComponentMemo;
