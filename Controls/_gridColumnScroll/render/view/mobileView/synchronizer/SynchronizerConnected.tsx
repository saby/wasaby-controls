/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { ColumnScrollContext } from 'Controls/columnScrollReact';
import { _StickyGroupContext } from 'Controls/stickyBlock';
import SynchronizerComponent, {
    TSynchronizerComponentProps,
    TSynchronizerComponentAPI,
} from './Synchronizer';

export { TSynchronizerComponentAPI as TSynchronizerConnectedComponentAPI };

export type TSynchronizerConnectedComponentProps = Omit<
    TSynchronizerComponentProps,
    'fixedElementSelector'
>;

function SynchronizerConnectedComponent(
    props: TSynchronizerConnectedComponentProps,
    ref: React.ForwardedRef<TSynchronizerComponentAPI>
): JSX.Element {
    const ctx = React.useContext(ColumnScrollContext);
    const scrollTop = React.useContext(_StickyGroupContext)?.scrollState?.scrollTop;

    return (
        <SynchronizerComponent
            ref={ref}
            fixedElementSelector={ctx.SELECTORS.FIXED_ELEMENT}
            itemsSizes={props.itemsSizes}
            hasStickyTopResults={props.hasStickyTopResults}
            hasStickyHeader={props.hasStickyHeader}
            synchronizeShadow={
                props.synchronizeShadow && (typeof scrollTop === 'number' ? scrollTop !== 0 : false)
            }
        />
    );
}

const SynchronizerConnectedComponentMemoForwarded = React.memo(
    React.forwardRef(SynchronizerConnectedComponent)
);

export default SynchronizerConnectedComponentMemoForwarded;
