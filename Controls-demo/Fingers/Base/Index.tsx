import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { default as Fingers } from 'Controls/Fingers';

import { flatData } from 'Controls-demo/Fingers/Data';

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    const items = new RecordSet({
        keyProperty: 'key',
        rawData: flatData,
    });

    const attrs = {
        style: {
            width: '250px',
            height: '400px',
        }
    };

    return (
        <Fingers
            items={items}
            keyProperty={'key'}
            displayProperty={'caption'}
            selectedKey={'1'}
            imageProperty={'image'}
            imageViewMode={'rectangle'}
            selectedStyle={'default'}
            alignment={'left'}
            attrs={attrs}
        />
    );
});
