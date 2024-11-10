import { ItemsView as View } from 'Controls/list';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
export default function ItemPadding2xs() {
    const items = new RecordSet({
        rawData: getData(),
        keyProperty: 'key',
    });
    return (
        <View items={items} displayProperty={'title'} itemPadding={{ left: '2xs', right: '2xs' }} />
    );
}
