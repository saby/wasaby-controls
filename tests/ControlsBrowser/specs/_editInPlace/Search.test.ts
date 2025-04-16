import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import SearchInput from '../../elements/search/Input';
import { tabletsSelector } from 'ControlsBrowser/elements/list/ListCommon';

describe('EditInPlace/Search', () => {
    let listView: ListView;
    let searchInput: SearchInput;

    beforeEach(() => {
        listView = new ListView();
        searchInput = new SearchInput();
    });

    it('редактирование работает во время поиска', async () => {
        // TestVDOMEditInPlaceRandomTasks.test_02_open_edit_with_search
        await openPage('Controls-demo/list_new/Searching/EditInPlace/Index');
        await expect(listView.items()).toBeElementsArrayOfSize(5);

        await searchInput.input().addValue('Tablets');
        await expect(listView.items()).toBeElementsArrayOfSize(1);

        await listView.edit(
            {
                index: 1,
            },
            {
                newText: 'тест',
                commit: true,
                applyButton: false,
            }
        );
        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveText('Tabletsтест');
        await expect(listView.items()).toBeElementsArrayOfSize(1);
    });

    it('редактирование закрывается при поиске, если текст в редакторе и текст в поиске не совпадают', async () => {
        // TestVDOMEditInPlaceRandomTasks.test_03_close_edit_with_search
        await openPage('Controls-demo/list_new/Searching/EditInPlace/Index');
        await expect(listView.items()).toBeElementsArrayOfSize(5);

        await listView.edit(tabletsSelector, {
            newText: 'тест',
        });
        await expect(listView.editor()).toHaveValue('Tabletsтест');

        await searchInput.input().addValue('Notebooks');
        await expect(listView.items()).toBeElementsArrayOfSize(1);
        await expect(listView.editor()).not.toExist();
        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveText('Notebooks');
    });
});
