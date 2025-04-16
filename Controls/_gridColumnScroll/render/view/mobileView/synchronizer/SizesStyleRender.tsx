/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
