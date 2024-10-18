import { forwardRef } from 'react';
import { ItemsView as View } from 'Controls/list';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';

export default forwardRef(function ItemPadding2xs(_, ref) {
    const items = new RecordSet({
        rawData: getData(),
        keyProperty: 'key',
    });
    return (
        <View
            ref={ref}
            items={items}
            displayProperty={'title'}
            itemPadding={{ left: '2xs', right: '2xs' }}
        />
    );
});
