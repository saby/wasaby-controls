import { openPage } from '../../helpers/openPage';
import SearchInput from '../../elements/search/Input';
import Common from '../../elements/Common';
import ListView from '../../elements/list/View';
import Page from '../../pages/list_new/PortionedSearch.page';

describe('Indicator/Search', () => {
    let searchInput: SearchInput;
    let page: Page;
    let listView: ListView;

    beforeEach(() => {
        searchInput = new SearchInput();
        page = new Page();
        listView = new ListView();
    });

    it('порционный поиск возобновляется после изменения запроса', async () => {
        // TestVDOMPortionedSearchDown.test_search_after_change_request
        await openPage(
            'Controls-demo/list_new/Searching/PortionedSearchMocked/Index'
        );

        await searchInput.search({
            searchString: 'Запись',
            searchButtonClick: true,
        });
        await page.continueFiveRecords().click();

        await expect(Common.continueSearchBottomIndicator()).toBeDisplayed({
            wait: 20000,
        });
        await expect(
            Common.continueSearchBottomIndicator()
        ).toHaveTextContaining('Продолжить поиск');
        await expect(listView.items()).toBeElementsArrayOfSize(5);

        await searchInput.input().addValue(['End', 'Backspace']);
        await searchInput.searchButton().click();
        await page.continueFiveRecords().click();

        await expect(page.abortSearch()).toBeDisplayed();
    });
});
