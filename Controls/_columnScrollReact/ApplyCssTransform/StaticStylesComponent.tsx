import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { QA_SELECTORS } from '../common/data-qa';

export interface IStaticStylesComponentProps {
    selectors: ISelectorsState;
}

/**
 * @private
 * @pure
 */
export function StaticStylesComponent(
    props: IStaticStylesComponentProps
): React.FunctionComponentElement<IStaticStylesComponentProps> {
    return (
        <style data-qa={QA_SELECTORS.STATIC_STYLES_TAG}>
            {
                // Hardware acceleration.
                // A lot of transformations can be executed on the GPU instead of the CPU. This enables better performance
                // https://v2.tailwindcss.com/docs/transform
                `.${props.selectors.FIXED_ELEMENT} {` +
                    'transform: translate3d(0, 0, 0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);' +
                    'will-change: transform;' +
                    '}' +
                    `.${props.selectors.HIDE_ALL_FIXED_ELEMENTS} .${props.selectors.FIXED_ELEMENT} {` +
                    'visibility: hidden;' +
                    '}'
            }
        </style>
    );
}

export const StaticStylesComponentMemo = React.memo(StaticStylesComponent);
export default StaticStylesComponentMemo;
