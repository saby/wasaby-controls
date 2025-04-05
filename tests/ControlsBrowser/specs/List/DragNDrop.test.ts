import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import DragNDrop from '../../elements/DragNDrop';
import {
    notebooksSelector,
    androidGadgetsSelector,
    tabletsSelector,
    laptopsSelector,
    ItemText,
} from 'ControlsBrowser/elements/list/ListCommon';

describe('Controls/list:View - DragNDrop', () => {
    let listView: ListView;

    beforeEach(() => {
        listView = new ListView();
    });

    // FIXME: странный кейс, он будет работать даже при поломке днд
    it('запись перемещается внутри списка и возвращается на место', async () => {
        // TestVDOMListDragNDrop.test_01_return
        await openPage('Controls-demo/list_new/DragNDrop/Index');

        await expect(listView.item(androidGadgetsSelector)).toBeDisplayed();

        await listView.item(notebooksSelector).moveTo();
        await DragNDrop.drag(await listView.item(notebooksSelector));
        await DragNDrop.moveTo(await listView.item(androidGadgetsSelector));

        await expect(listView.items()).toBeElementsArrayOfSize(5);

        await DragNDrop.moveToElementBy(await listView.item(tabletsSelector), {
            xOffset: 100,
            yOffset: -2,
        });

        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveText('Notebooks');

        await DragNDrop.drop();

        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveText('Notebooks');
    });

    it('запись перемещается снаружи списка и возвращается на место', async () => {
        // TestVDOMListDragNDrop.test_02_outside
        await openPage('Controls-demo/list_new/DragNDrop/Index');

        await expect(listView.item(androidGadgetsSelector)).toBeDisplayed();

        await listView.item(laptopsSelector).moveTo();
        await DragNDrop.drag(await listView.item(laptopsSelector));

        await DragNDrop.moveToElementBy(await listView.container(), {
            xOffset: 0,
            yOffset: 100,
        });
        await DragNDrop.drop();

        await expect(listView.item({ index: 3 })).toHaveTextContaining(ItemText.Laptops);
    });
});
