import * as React from 'react';
import { View } from 'Controls/toolbars';
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

function Counter(_, ref) {
    const items = new RecordSet({
        keyProperty: 'id',
        rawData: data.getItemsWithCounter(),
    });

    return (
        <div ref={ref} className="controls-margin_left-l">
            <div className="controls-text-label controls-margin_bottom-s">direction=horizontal</div>
            <View direction="horizontal" items={items} inlineHeight="l" keyProperty="id" />
            <div className="controls-text-label controls-margin_bottom-s controls-margin_top-xl">
                direction=vertical
            </div>
            <div style={{ marginLeft: '75px' }}>
                <View
                    data-qa="Controls-demo_Toolbar_Counter__vertical"
                    direction="vertical"
                    items={items}
                    inlineHeight="l"
                    keyProperty="id"
                />
            </div>
        </div>
    );
}

export default React.forwardRef(Counter);
