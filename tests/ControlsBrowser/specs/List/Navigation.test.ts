import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import Scroll from '../../elements/scroll/Container';
import Page from '../../pages/list_new/LoadingIndicatorBoth.page';
import Common from '../../elements/Common';
import { scrollList } from '../../helpers/scrollList';
import { setScrollTop } from '../../helpers/scroll';

describe('Controls/list:View - Navigation', () => {
    let listView: ListView;
    let page: Page;
    let scroll: Scroll;

    beforeEach(() => {
        listView = new ListView();
        page = new Page();
        scroll = new Scroll();
    });

    it('подгрузка по скроллу вниз работает', async () => {
        // TestVDOMNavigationDown.test_01_list
        await openPage(
            'Controls-demo/list_new/Navigation/Direction/Down/Index'
        );

        await listView.container().moveTo();

        await expect(listView.paging()).toBeDisplayed();
        await expect(listView.items()).toBeElementsArrayOfSize(20);

        await listView
            .item({
                index: 17,
            })
            .scrollIntoView();

        await expect(listView.items()).toBeElementsArrayOfSize(30);
    });

    it('подгрузка по скроллу вверх работает', async () => {
        // TestVDOMNavigationUp.test_01_list
        await openPage('Controls-demo/list_new/Navigation/Direction/Up/Index');

        await listView.container().moveTo();

        await expect(listView.paging()).toBeDisplayed();
        await expect(listView.items()).toBeElementsArrayOfSize(20);

        await listView
            .item({
                index: 1,
            })
            .scrollIntoView();

        await expect(listView.items()).toBeElementsArrayOfSize(30);
    });

    it('не возникает повторной подгрузки ранее загруженных записей при возвращении по скроллу', async () => {
        // TestVDOMNavigationBoth.test_not_reload
        await openPage('Controls-demo/list_new/LoadingIndicator/Both/Index');

        await page.button().click();

        await expect(Common.globalIndicator()).toBeDisplayed();

        await listView
            .item({
                index: 2,
            })
            .moveTo();

        await expect(Common.globalIndicator()).not.toBeDisplayed();
        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveText('Запись #0');
        await expect(listView.items()).toBeElementsArrayOfSize(15);

        await scrollList(listView, 'Запись #', 14, 71, 14);

        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveText('Запись #0');

        await listView
            .item({
                index: 1,
            })
            .scrollIntoView();
        // FIXME: на этом оригинальный тест обрывается, но, судя по проверке, нужно проверять что индикатор не вылез.
    });

    it('при скролле вниз индикатор появляется внизу', async () => {
        // TestVDOMPaging.test_02_scroll_down
        await openPage('Controls-demo/list_new/LoadingIndicator/Down/Index');

        await listView
            .item({
                index: 4,
            })
            .moveTo();

        await listView.paging().waitForDisplayed();

        await listView.item({ index: 20 }).scrollIntoView();
        await page.checkBottomIndicator(listView);
    });

    it('при скролле вверх индикатор появляется вверху', async () => {
        // TestVDOMPaging.test_03_scroll_up
        await openPage('Controls-demo/list_new/LoadingIndicator/Up/Index');

        await listView
            .item({
                index: 4,
            })
            .moveTo();

        await listView.paging().waitForDisplayed();

        // По идее,можно заменить на await Common.topIndicator().scrollIntoView();
        const scrollContent = await scroll.content();
        await setScrollTop(scrollContent, 0);

        await page.checkTopIndicator(listView);
    });
});
