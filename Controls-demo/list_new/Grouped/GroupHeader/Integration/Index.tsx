import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';

import IconStyle from 'Controls-demo/list_new/Grouped/GroupHeader/Integration/IconStyle';

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className={'tw-flex tw-flex-wrap'}>
            <IconStyle />
        </div>
    );
}

export default React.forwardRef(Demo);
