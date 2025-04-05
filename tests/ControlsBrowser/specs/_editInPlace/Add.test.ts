import { openPage } from '../../helpers/openPage';
import { clickOnCoordinates } from '../../helpers/clickOnCoordinates';
import ListView from '../../elements/list/View';
import GridView from '../../elements/grid/View';
import {
    notebooksSelector,
    tabletsSelector,
    ItemText,
} from 'ControlsBrowser/elements/list/ListCommon';

describe('EditInPlace/Add', () => {
    let listView: ListView;
    let gridView: GridView;

    beforeEach(() => {
        listView = new ListView();
        gridView = new GridView();
    });

    it('работает сохранение по нажатию на зелёную галочку', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_01_save_toolbar
        await openPage('Controls-demo/list_new/EditInPlace/Toolbar/Index');

        await listView.edit(tabletsSelector, {
            newText: '123',
            commit: true,
        });

        await expect(
            listView.item({
                text: 'Tablets123',
            })
        ).toExist();
        await expect(listView.editor()).not.toExist();
        await expect(
            listView.marker({
                text: 'Tablets123',
            })
        ).toBeDisplayed();
    });

    it('работает сохранение при нажатии на соседнюю строку', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_03_save_click_next_record
        await openPage('Controls-demo/list_new/EditInPlace/Toolbar/Index');

        await listView.edit(tabletsSelector, {
            newText: '123',
        });
        await listView.item(notebooksSelector).click();

        await expect(
            listView.item({
                text: `${ItemText.Tablets}123`,
            })
        ).toExist();
        await expect(listView.editor()).toHaveValueContaining(ItemText.Notebooks);
    });

    it('редактирование не сбрасывается при нажатии вне записей', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_04_save_outside_click
        await openPage('Controls-demo/list_new/EditInPlace/Toolbar/Index');

        await listView.edit(tabletsSelector, {
            newText: '123',
        });
        const { x, y, width } = await browser.getElementRect(
            (
                await listView.container()
            ).elementId
        );
        await clickOnCoordinates(x, y, width / 2, -20);

        await expect(listView.editor()).toHaveValueContaining(`${ItemText.Tablets}123`);
    });

    it('редактирование отменяется при нажатии на крестик', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_06_close_edit_toolbar
        await openPage('Controls-demo/list_new/EditInPlace/Toolbar/Index');

        await listView.edit(tabletsSelector, {
            newText: '123',
        });
        await listView.cancelEditingButton().waitForClickable();
        await listView.cancelEditingButton().click();

        await expect(listView.editor()).not.toExist();
        await expect(listView.item(tabletsSelector)).toExist();
        await expect(listView.marker(tabletsSelector)).toBeDisplayed();
    });

    // Это уже не плоский список, а грид.
    it('работает сохранение при сворачивании групп', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_save_collapse
        await openPage('Controls-demo/gridNew/Grouped/WithEditing/Index');

        const itemGroupSelector = { index: 2 };
        const outsideGroupSelector = { index: 1 };

        await gridView.editCell(5, 2, {
            clearValue: true,
        });

        // Сворачиваем соседнюю группу
        await gridView.collapseGroup(outsideGroupSelector);
        await gridView.checkValidationState(true);

        // Пытаемся свернуть группу, в которой редактируемый элемент
        // Т.к. часть элементов скрыта, ио наш элемент будет первый
        await gridView.collapseGroup(itemGroupSelector);
        await expect(gridView.cellEditor(1, 2)).toExist();
        await gridView.checkValidationState(false);

        // Вводим текст и сворачиваем группу, в которой редактируемый элемент
        await gridView.editCell(1, 2, {
            newText: 'Тест',
        });
        await gridView.collapseGroup(itemGroupSelector);
        await expect(gridView.editor()).not.toExist();

        await gridView.expandGroup(itemGroupSelector);
        await expect(gridView.item({ text: 'Тест' })).toExist();
    });

    it('Редактирование не запускается, если недоступно для записи', async () => {
        // TestVDOMEditInPlace.test_01_not_editor_by_click
        await openPage('Controls-demo/list_new/EditInPlace/BeginEdit/Index');

        const text = 'В строке недоступно редактирование';
        await listView.item({ text }).click();
        await expect(listView.editor()).not.toExist();
        await expect(listView.marker({ text })).toBeDisplayed();
    });
});
