import * as React from 'react';
import { IColumnScrollWidths } from '../common/interfaces';
import { ISelectorsState } from '../common/selectors';
import { QA_SELECTORS } from '../common/data-qa';

export interface IWidthsDependentStylesComponentProps
    extends Pick<IColumnScrollWidths, 'startFixedWidth' | 'endFixedWidth' | 'viewPortWidth'> {
    selectors: ISelectorsState;
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
            {`.${props.selectors.OFFSET_FOR_START_FIXED_ELEMENT} { left: ${props.startFixedWidth}px; }`}
            {`.${props.selectors.OFFSET_FOR_END_FIXED_ELEMENT} { right: ${props.endFixedWidth}px; } `}
            {`.${props.selectors.STRETCHED_TO_VIEWPORT_ELEMENT} { width: ${props.viewPortWidth}px; }`}
        </style>
    );
}

export const WidthsDependentStylesComponentMemo = React.memo(WidthsDependentStylesComponent);
export default WidthsDependentStylesComponentMemo;
