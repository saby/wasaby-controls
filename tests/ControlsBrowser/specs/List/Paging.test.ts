import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import Paging from '../../elements/list/Paging';

describe('Controls/list:View - Paging', () => {
    let listView: ListView;
    let paging: Paging;

    beforeEach(() => {
        listView = new ListView();
        paging = new Paging();
    });

    it('кнопки пейджинга должны иметь правильный title', async () => {
        // TestVDOMPaging.test_01_title
        await openPage('Controls-demo/list_new/Navigation/ScrollPaging/Index');

        await listView
            .item({
                index: 5,
            })
            .moveTo();

        await expect(paging.next()).toHaveAttr('title', 'Вперёд');
        await expect(paging.prev()).toHaveAttr('title', 'Назад');
        await expect(paging.begin()).toHaveAttr('title', 'В начало');
    });
});
