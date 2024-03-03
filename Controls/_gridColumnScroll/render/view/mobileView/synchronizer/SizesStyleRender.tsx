/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { ISize } from './types';
import { getSizesStyle } from './utils';

type TKeyMask = '$key$';
const KEY_MASK_TOKEN: TKeyMask = '$key$';

export type TSelectorMask = `${string}${TKeyMask}${string}`;

export interface ISizesSynchronizerComponentProps {
    dataQa: string;
    keyMask: TSelectorMask;
    sizes: ISize[];
    beforeContentSize?: number;
}

function SizesSynchronizerComponent(props: ISizesSynchronizerComponentProps): JSX.Element {
    return (
        <style data-qa={props.dataQa}>
            {getSizesStyle(props.keyMask, KEY_MASK_TOKEN, props.sizes, props.beforeContentSize)}
        </style>
    );
}

const SizesSynchronizerComponentMemo = React.memo(SizesSynchronizerComponent);
export default SizesSynchronizerComponentMemo;
