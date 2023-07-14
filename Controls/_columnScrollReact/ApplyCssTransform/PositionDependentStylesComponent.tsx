import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { getTransformCSSRule } from '../common/helpers';
import { QA_SELECTORS } from '../common/data-qa';

export interface IPositionDependentStylesComponentProps {
    selectors: ISelectorsState;
    position: number;
}

/**
 * @private
 * @pure
 */
export function PositionDependentStylesComponent(
    props: IPositionDependentStylesComponentProps
): React.FunctionComponentElement<IPositionDependentStylesComponentProps> {
    const styles =
        `.${props.selectors.ROOT_TRANSFORMED_ELEMENT} {${getTransformCSSRule(-props.position)}}` +
        `.${props.selectors.FIXED_ELEMENT} {${getTransformCSSRule(props.position)}}`;

    return <style data-qa={QA_SELECTORS.POSITION_STYLES_TAG}>{styles}</style>;
}

export const PositionDependentStylesComponentMemo = React.memo(PositionDependentStylesComponent);
export default PositionDependentStylesComponentMemo;
