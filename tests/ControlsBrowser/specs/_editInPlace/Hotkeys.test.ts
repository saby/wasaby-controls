import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import {
    notebooksSelector,
    androidGadgetsSelector,
    tabletsSelector,
    ItemText,
} from '../../elements/list/ListCommon';

describe('EditInPlace/Hotkeys', () => {
    let listView: ListView;

    beforeEach(() => {
        listView = new ListView();
    });

    it('работает сохранение по нажатию на Enter с переходом к редактированию следующей строки', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_02_save_enter
        await openPage('Controls-demo/list_new/EditInPlace/Toolbar/Index');

        await listView.edit(tabletsSelector, {
            newText: '123',
            commit: true,
            applyButton: false,
        });

        await expect(
            listView.item({
                text: `${ItemText.Tablets}123`,
            })
        ).toExist();
        await expect(listView.editor()).toHaveValueContaining(ItemText.Laptops);
    });

    it('работает сохранение по нажатию на Enter без перехода к редактированию следующей строки', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_09_add_text
        await openPage('Controls-demo/list_new/EditInPlace/BeginEdit/Index');

        const text = 'Стандартное начало редактирования';
        await listView.edit(
            { text },
            {
                newText: '123',
                commit: true,
                applyButton: false,
            }
        );

        await expect(
            listView.item({
                text: `${text}123`,
            })
        ).toExist();
        await expect(listView.editor()).not.toExist();
        await expect(
            listView.marker({
                text: `${text}123`,
            })
        ).toBeDisplayed();
    });

    // FIXME Скипался для safari https://feedbackassistant.apple.com/feedback/9118663
    it('работает сохранение по нажатию на Enter записи, которая сразу открыта на редактирование', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_10_editing_on_mounting_enter
        await openPage('Controls-demo/list_new/EditInPlace/EditingOnMounting/Index');

        await expect(listView.editor()).toExist();
        await listView.editor().addValue(['123', 'Enter']);

        await expect(listView.editor()).not.toExist();
        await expect(
            listView.item({
                text: `${ItemText.Notebooks}123`,
            })
        ).toExist();
    });

    it('работает валидация перед сохранением при редактировании', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_13_not_close_editor
        await openPage('Controls-demo/list_new/EditInPlace/EndEdit/Index');

        const text = 'Редактирование не завершится если поле пустое';
        await listView.edit(
            { text },
            {
                clearValue: true,
            }
        );
        await listView.editor().addValue('Enter');

        await expect(listView.editor()).toExist();
        await expect(listView.editor()).toHaveValue('');
    });

    it('работает отмена редактирования при нажатии клавиши Esc', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_07_close_edit_esc
        await openPage('Controls-demo/list_new/EditInPlace/Toolbar/Index');

        await listView.edit(tabletsSelector, {
            newText: '123',
        });
        await listView.editor().addValue('Escape');

        await expect(listView.editor()).not.toExist();
        await expect(listView.item(tabletsSelector)).toExist();
    });

    // FIXME Скипался для safari https://feedbackassistant.apple.com/feedback/9118663
    it('работает отмена редактирования при нажатии клавиши Esc записи, которая сразу открыта на редактирование', async () => {
        // TestVDOMEditInPlaceAddAndSave.test_11_editing_on_mounting_esc
        await openPage('Controls-demo/list_new/EditInPlace/EditingOnMounting/Index');

        await expect(listView.editor()).toExist();
        await listView.editor().addValue('123');
        await listView.editor().addValue('Escape');

        await expect(listView.editor()).not.toExist();
        await expect(listView.item(notebooksSelector)).toExist();
    });

    it('переходит к редактированию следующей записи по нажатию кнопки вниз/вверх', async () => {
        // TestVDOMEditInPlaceList.test_sequential_editing
        await openPage('Controls-demo/list_new/EditInPlace/SequentialEditing/Index');

        await listView.item(notebooksSelector).click();
        await expect(listView.editor()).toHaveValue('Notebooks');

        await listView.editor().addValue('ArrowDown');
        await expect(listView.editor()).toHaveValue('Tablets');

        await listView.editor().addValue('ArrowDown');
        await expect(listView.editor()).toHaveValue('Laptop computers');

        await listView.item(androidGadgetsSelector).click();
        await expect(listView.editor()).toHaveValue('Android gadgets');

        await listView.editor().addValue('ArrowUp');
        await expect(listView.editor()).toHaveValue('Apple gadgets');

        await listView.editor().addValue('ArrowUp');
        await expect(listView.editor()).toHaveValue('Laptop computers');
    });

    it('переходит к редактированию следующей записи по нажатию кнопки вниз/вверх, пропуская недоступные строки', async () => {
        // TestVDOMEditInPlaceHotKeys2.test_inaccessible_lines
        await openPage('Controls-demo/list_new/EditInPlace/SkipItem/Index');

        await listView.item(notebooksSelector).click();
        await expect(listView.editor()).toHaveValue('Notebooks');

        await listView.editor().addValue('ArrowDown');
        await expect(listView.editor()).toHaveValue('Apple gadgets');

        await listView.editor().addValue(['Home', '1']);
        await expect(listView.editor()).toHaveValue('1Apple gadgets');

        await listView.editor().addValue('ArrowUp');
        await expect(listView.editor()).toHaveValue('Notebooks');

        await listView.editor().addValue(['Home', '1']);
        await expect(listView.editor()).toHaveValue('1Notebooks');
    });

    it('переходит к редактированию следующей записи по нажатию кнопки вниз/вверх, даже если записи разбиты на группы', async () => {
        // TestVDOMEditInPlaceHotKeys2.test_down_up_with_groups
        await openPage('Controls-demo/list_new/EditInPlace/Grouped/Index');

        await listView
            .item({
                textContaining: 'MacBook Pro',
            })
            .click();
        await expect(listView.editor()).toHaveValue('MacBook Pro');

        await listView.editor().addValue('ArrowDown');
        await expect(listView.editor()).toHaveValue('ASUS X751SA-TY124D');

        await listView.editor().addValue('ArrowDown');
        await expect(listView.editor()).toHaveValue('HP 250 G5 (W4N28EA)');

        await listView.editor().addValue('ArrowUp');
        await expect(listView.editor()).toHaveValue('ASUS X751SA-TY124D');
    });

    it('после завершения редактирования последней записи должно сработать автодобавление', async () => {
        // TestVDOMEditInPlaceList.test_auto_add
        await openPage('Controls-demo/list_new/EditInPlace/AutoAdd/Index');

        await listView
            .item({
                textContaining: 'Android gadgets',
            })
            .click();
        await expect(listView.editor()).toHaveValue('Android gadgets');

        const prevCount = (await listView.items()).length;
        await browser.keys('Enter');
        await expect(listView.items()).toBeElementsArrayOfSize(prevCount + 1);
        await expect(listView.editor()).toHaveValue('');
    });
});
