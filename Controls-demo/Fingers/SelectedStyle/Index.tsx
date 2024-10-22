import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { default as Fingers, TSelectedStyle } from 'Controls/Fingers';

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
        },
    };

    // Варианты значений
    const selectedStyleValues: TSelectedStyle[] = [
        'default',
        'primary',
        'secondary',
        'warning',
        'success',
        'danger',
        'info',
    ];

    const variants = [];
    selectedStyleValues.forEach((style) => {
        variants.push(
            <Fingers
                key={style}
                items={items}
                keyProperty={'key'}
                displayProperty={'caption'}
                selectedKey={'1'}
                imageProperty={'image'}
                imageViewMode={'rectangle'}
                selectedStyle={style}
                alignment={'left'}
                attrs={attrs}
            />
        );
    });

    return (
        <div
            ref={ref}
            className="controlsDemo_widthFit controlsDemo__height200"
            data-qa="controlsDemo_capture"
        >
            <div className={'controls-margin-m ws-flexbox'}>{variants}</div>
        </div>
    );
});
