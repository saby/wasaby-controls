/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { AutoScrollTargetElement } from 'Controls/columnScrollReact';
import useGridAutoScrollTargetsStyles, {
    TUseGridAutoScrollTargetsStylesProps,
} from './useGridAutoScrollTargetsStyles';
import { QA_SELECTORS } from '../../../common/data-qa';

export type TAutoScrollTargetsProps = TUseGridAutoScrollTargetsStylesProps;

function AutoScrollTargets(props: TAutoScrollTargetsProps): JSX.Element {
    const { startFixedCellStyle, scrollableCellStyles, endFixedCellStyle } =
        useGridAutoScrollTargetsStyles(props);

    return (
        <div className="tw-contents" data-qa={QA_SELECTORS.AUTOSCROLL_TARGETS}>
            {startFixedCellStyle && <div style={startFixedCellStyle} />}

            {scrollableCellStyles.map((style, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <AutoScrollTargetElement style={style} key={key} />
            ))}

            {endFixedCellStyle && <div style={endFixedCellStyle} />}
        </div>
    );
}

const AutoScrollTargetsMemo = React.memo(AutoScrollTargets);
export default AutoScrollTargetsMemo;
