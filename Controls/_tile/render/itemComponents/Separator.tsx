import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import type { RootSeparatorItem } from 'Controls/baseTree';

interface IProps extends TInternalProps {
    item: RootSeparatorItem;
}

function Separator(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const wrapperClassName = props.item.getWrapperClasses();
    return (
        <div ref={ref} className={wrapperClassName}>
            <div className={'controls-TileView__searchSeparator_line_horizontal'} />
        </div>
    );
}

export default React.forwardRef(Separator);
