import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { getTransformCSSRule, getMaxScrollPosition } from '../common/helpers';
import { QA_SELECTORS } from '../common/data-qa';
import { IColumnScrollContext } from '../context/ColumnScrollContext';

export interface IPositionDependentStylesComponentProps {
    selectors: ISelectorsState;
    fixedWidth: IColumnScrollContext['fixedWidth'];
    contentWidth: IColumnScrollContext['contentWidth'];
    viewPortWidth: IColumnScrollContext['viewPortWidth'];
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
        `.${props.selectors.FIXED_ELEMENT} {${getTransformCSSRule(props.position)}}` +
        `.${props.selectors.FIXED_TO_RIGHT_EDGE_ELEMENT} {${getTransformCSSRule(props.position - getMaxScrollPosition(props))}`;

    return <style data-qa={QA_SELECTORS.POSITION_STYLES_TAG}>{styles}</style>;
}

export const PositionDependentStylesComponentMemo = React.memo(PositionDependentStylesComponent);
export default PositionDependentStylesComponentMemo;
