import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import Confirmation from '../../elements/popup/Confirmation';
import Menu from '../../elements/popup/Menu';
import MarkerOnReloadPage from '../../pages/list_new/MarkerOnReload.page';
import SlowAddingPage from '../../pages/list_new/SlowAdding.page';
import ItemsViewBasePage from 'ControlsBrowser/pages/list_new/ItemsViewBase.page';
import OnGroupCollapsedPage from 'ControlsBrowser/pages/list_new/OnGroupCollapsed.page';
import ItemClickBasePage from '../../pages/list_new/ItemClickBase.page';
import ItemClickWithEditingPage from 'ControlsBrowser/pages/list_new/ItemClickWithEditing.page';
import Common from '../../elements/Common';
import { clickWithModifier } from 'ControlsBrowser/helpers/clickWithModifier';
import { switchToLastOpenedTab } from 'ControlsBrowser/helpers/switchToLastOpenedTab';
import {
    notebooksSelector,
    tabletsSelector,
    laptopsSelector,
    appleGadgetsSelector,
    androidGadgetsSelector,
} from 'ControlsBrowser/elements/list/ListCommon';

describe('Controls/list:View', () => {
    let listView: ListView;
    let confirmation: Confirmation;
    let menu: Menu;
    let markerOnReloadPage: MarkerOnReloadPage;
    let slowAddingPage: SlowAddingPage;
    let itemsViewBasePagePage: ItemsViewBasePage;
    let onGroupCollapsedPage: OnGroupCollapsedPage;
    let itemClickWithEditingPage: ItemClickWithEditingPage;
    let itemClickBasePage: ItemClickBasePage;

    beforeEach(() => {
        listView = new ListView();
        confirmation = new Confirmation();
        menu = new Menu();
        markerOnReloadPage = new MarkerOnReloadPage();
        slowAddingPage = new SlowAddingPage();
        itemsViewBasePagePage = new ItemsViewBasePage();
        onGroupCollapsedPage = new OnGroupCollapsedPage();
        itemClickWithEditingPage = new ItemClickWithEditingPage();
        itemClickBasePage = new ItemClickBasePage();
    });

    // FIXME: я не знаю о чём был этот тест, он выглядит бесполезно
    it('у элементов списка должен быть cursor: pointer', async () => {
        // TestVDOMListView.test_01_cursor_pointer
        await openPage('Controls-demo/list_new/EditInPlace/AddItem/Index');

        await expect(
            listView.item({
                index: 1,
            })
        ).toBeDisplayed();

        await expect(listView.item(tabletsSelector)).toHaveElementClass(
            'controls-ListView__itemV_cursor-pointer'
        );
    });

    it('маркер не теряет позицию при перезагрузке списка', async () => {
        // TestVDOMListView.test_03_marker_on_reload
        await openPage('Controls-demo/list_new/Marker/OnReload/Index');

        await listView.item(appleGadgetsSelector).click();
        await expect(listView.marker(appleGadgetsSelector)).toBeDisplayed();

        await markerOnReloadPage.reloadListLink().click();
        await expect(markerOnReloadPage.reloadResultText()).toHaveText(
            'list reloaded'
        );
        await expect(listView.marker(appleGadgetsSelector)).toBeDisplayed();
    });

    it('маркер должен устанавливаться при помощи клика мышью и кнопок навигации на клавиатуре', async () => {
        // TestVDOMListView.test_02_marker
        await openPage('Controls-demo/list_new/Navigation/ScrollPaging/Index');

        const firstItemSelector = { index: 1 };
        const thirdItemSelector = { index: 3 };
        const fourthItemSelector = { index: 4 };
        const sixthItemSelector = { index: 6 };
        // const seventhItemSelector = { index: 7 };

        await listView.item(firstItemSelector).click();
        await expect(listView.marker(firstItemSelector)).toBeDisplayed();

        for (let i = 0; i < 3; i++) {
            await browser.keys('ArrowDown');
        }

        await expect(listView.marker(firstItemSelector)).not.toBeDisplayed();
        await expect(listView.marker(fourthItemSelector)).toBeDisplayed();

        await browser.keys('ArrowUp');
        await expect(listView.marker(thirdItemSelector)).toBeDisplayed();

        // FIXME Для safari бралась запись на одну ниже if BrowserNames.is_safari() 7 else 6
        await browser.keys('PageDown');
        await expect(listView.marker(sixthItemSelector)).toBeDisplayed();

        await browser.keys('PageUp');
        await expect(listView.marker(firstItemSelector)).toBeDisplayed();
    });

    it('записи должны отмечаться с помощью пробела', async () => {
        // TestVDOMListView.test_10_asynchronous_processing
        // FIXME условие для IE param = "?timeout=3000" if BrowserNames.is_ie() else ""
        await openPage(
            'Controls-demo/list_new/Marker/OnBeforeMarkedKeyChanged/Index'
        );

        const itemSelector = { index: 2 };

        await listView.item(itemSelector).click();
        await expect(listView.marker(itemSelector)).not.toBeDisplayed();
        await listView.marker(itemSelector).waitForDisplayed();
    });

    it('возникает ромашка при медленном добавлении', async () => {
        // TestVDOMListView.test_04_loading
        await openPage('Controls-demo/list_new/EditInPlace/SlowAdding/Index');
        await expect(
            listView.item({
                index: 1,
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                index: 1,
            })
        ).toHaveTextContaining('3 сек');
        await expect(Common.globalIndicator()).not.toExist();

        await slowAddingPage.addRecord().click();

        await expect(Common.globalIndicator()).toBeDisplayed();
        await expect(listView.editor()).toHaveValueContaining(
            'после задержки в 3 сек'
        );
        await expect(Common.globalIndicator()).not.toBeDisplayed();

        await slowAddingPage.addRecord().click();
        await expect(listView.editor()).not.toExist();
        await expect(Common.globalIndicator()).toBeDisplayed();
        await expect(listView.editor()).toHaveValueContaining(
            'после задержки в 3 сек'
        );
        await expect(Common.globalIndicator()).not.toBeDisplayed();
    });

    it('записи должны отмечаться с помощью пробела', async () => {
        // TestVDOMListView.test_05_hot_keys
        await openPage(
            'Controls-demo/list_new/MultiSelect/MultiSelectVisibility/Visible/Index'
        );

        await listView.select(notebooksSelector);

        await listView.checkCheckboxState(tabletsSelector, false);
        await expect(listView.marker(notebooksSelector)).toBeDisplayed();

        await listView.container().addValue(' ');

        await listView.checkCheckboxState(notebooksSelector, false);
        await listView.checkCheckboxState(tabletsSelector, false);
        await expect(listView.marker(tabletsSelector)).toBeDisplayed();

        await listView.container().addValue(' ');

        await listView.checkCheckboxState(tabletsSelector, true);
        await listView.checkCheckboxState(laptopsSelector, false);
        await expect(listView.marker(laptopsSelector)).toBeDisplayed();

        await listView.container().addValue(' ');

        await listView.checkCheckboxState(tabletsSelector, true);
        await listView.checkCheckboxState(laptopsSelector, true);
        await listView.checkCheckboxState(appleGadgetsSelector, false);
        await expect(listView.marker(appleGadgetsSelector)).toBeDisplayed();
    });

    // FIXME для IE условие @pytest.mark.skipif(BrowserNames.is_ie(), reason='IE:
    //  https://online.sbis.ru/opendoc.html?guid=6126d85a-d541-4ac4-bdf8-56f5d1f7ca91')
    it('записи должны отмечаться с помощью пробела', async () => {
        // TestVDOMListView.test_hot_shift
        await openPage(
            'Controls-demo/list_new/MultiSelect/MultiSelectVisibility/Visible/Index'
        );

        await listView.checkbox(tabletsSelector).click();
        await expect(listView.marker(tabletsSelector)).toBeDisplayed();

        await clickWithModifier(
            listView.checkbox(androidGadgetsSelector),
            'Shift'
        );
        await expect(listView.marker(androidGadgetsSelector)).toBeDisplayed();

        await listView.checkCheckboxState(notebooksSelector, false);
        await listView.checkCheckboxState(tabletsSelector, true);
        await listView.checkCheckboxState(laptopsSelector, true);
        await listView.checkCheckboxState(appleGadgetsSelector, true);
        await listView.checkCheckboxState(androidGadgetsSelector, true);
    });

    it('в режиме readonly записи не должны отмечаться', async () => {
        // TestVDOMListView.test_06_checkbox_readonly
        await openPage(
            'Controls-demo/list_new/ItemTemplate/CheckboxReadOnly/Index'
        );

        await listView.checkbox(notebooksSelector).click();

        await listView.checkCheckboxState(notebooksSelector, false);
        await expect(listView.marker(notebooksSelector)).toBeDisplayed();

        await listView.checkbox(tabletsSelector).click();

        await listView.checkCheckboxState(tabletsSelector, false);
        await expect(listView.marker(tabletsSelector)).toBeDisplayed();

        await listView.container().addValue(' ');

        await listView.checkCheckboxState(tabletsSelector, false);
        await listView.checkCheckboxState(laptopsSelector, false);
        await expect(listView.marker(laptopsSelector)).toBeDisplayed();
    });

    describe('Списки без источника данных', () => {
        it('строки добавляются и удаляются', async () => {
            // TestVDOMListView.test_07_no_sources
            await openPage('Controls-demo/list_new/ItemsView/Base/Index');

            await expect(listView.items()).toBeElementsArrayOfSize(2);
            await expect(
                listView.item({
                    index: 1,
                })
            ).toHaveTextContaining('row with id 1');
            await expect(
                listView.item({
                    index: 2,
                })
            ).toHaveTextContaining('row with id 2');

            await itemsViewBasePagePage.addRowBase().click();

            await expect(listView.items()).toBeElementsArrayOfSize(3);
            await expect(
                listView.item({
                    index: 1,
                })
            ).toHaveTextContaining('row with id 1');
            await expect(
                listView.item({
                    index: 2,
                })
            ).toHaveTextContaining('row with id 2');
            await expect(
                listView.item({
                    index: 3,
                })
            ).toHaveTextContaining('row with id 3');

            await itemsViewBasePagePage.delRowBase().click();

            await expect(listView.items()).toBeElementsArrayOfSize(2);
            await expect(
                listView.item({
                    index: 1,
                })
            ).toHaveTextContaining('row with id 2');
            await expect(
                listView.item({
                    index: 2,
                })
            ).toHaveTextContaining('row with id 3');
        });
    });

    it('группы сворачиваются и разворачиваются по нажатию на заголовок', async () => {
        // TestVDOMListView.test_group_collapse
        await openPage('Controls-demo/list_new/Grouped/OnGroupCollapsed/Index');

        await listView.collapseGroup({
            textContaining: 'apple',
        });
        await expect(onGroupCollapsedPage.clickMessage()).toHaveText(
            'Свернули группу с id="apple".'
        );

        await listView.collapseGroup({
            textContaining: 'asus',
        });
        await expect(onGroupCollapsedPage.clickMessage()).toHaveText(
            'Свернули группу с id="asus".'
        );

        await listView.expandGroup({
            textContaining: 'apple',
        });
        await expect(onGroupCollapsedPage.clickMessage()).toHaveText(
            'Развернули группу с id="apple".'
        );
    });

    it('элемент списка открывается в новой вкладке по Ctrl+ЛКМ', async () => {
        // TestVDOMListView.test_opening_with_ctrl
        await openPage('Controls-demo/list_new/OpenUrl/Index');

        await listView
            .item({
                textContaining: 'При нажатии на записи',
            })
            .moveTo();
        await clickWithModifier(
            listView.item({
                textContaining: 'При нажатии на записи',
            }),
            'Control'
        );
        await switchToLastOpenedTab();

        try {
            await expect(browser).toHaveUrlContaining(
                'Controls-demo%2Flist_new%2FOpenUrl%2FPages%2FSecond'
            );
        } catch (e) {
            throw e;
        } finally {
            // TODO: https://online.sbis.ru/opendoc.html?guid=77889e88-1d60-46eb-980c-123b9116328e
            const windows = await browser.getWindowHandles();
            for (let i = windows.length - 1; i >= 1; i--) {
                await browser.switchToWindow(windows[i]);
                await browser.closeWindow();
            }
            await browser.switchToWindow(windows[0]);
        }
    });

    it('удаление можно отменяется через диалог подтверждения', async () => {
        // TestVDOMListView.test_remove
        await openPage('Controls-demo/list_new/RemoveController/Index');

        await listView.delete({
            textContaining: 'Удаление записи с вопросом',
        });
        await confirmation.select('Нет');

        await expect(
            listView.item({
                textContaining: 'Удаление записи с вопросом',
            })
        ).toBeDisplayed();
    });

    it('событие itemClick не срабатывает при установке чекбокса, нажатии на элемент правой кнопкой, выборе операции над записью', async () => {
        // TestVDOMListActions.test_no_actions
        await openPage('Controls-demo/list_new/ItemClick/WithEditing/Index');

        await listView.openItemActionMenu({
            index: 1,
        });
        await itemClickWithEditingPage.checkHiddenInfo();
        await menu.close();

        await listView.openContextMenu({
            index: 2,
        });
        await itemClickWithEditingPage.checkHiddenInfo();
        await menu.close();

        await itemClickWithEditingPage.multiselect().click();
        await listView.select({
            index: 3,
        });
        await itemClickWithEditingPage.checkHiddenInfo();
    });

    it('Работают события активации записи при клике и переходам горячими клавишами', async () => {
        // TestVDOMListActions.test_get_info_active_record
        await openPage('Controls-demo/list_new/ItemClick/Base/Index');
        let eventsLogPanelText = '';

        await listView.item({ index: 1 }).click();
        await expect(listView.marker({ index: 1 })).toBeDisplayed();

        eventsLogPanelText =
            'Выполнили клик по key: 0; активировали item-key: 0';
        await expect(itemClickBasePage.eventsLogPanel()).toHaveText(
            eventsLogPanelText
        );

        await browser.keys('ArrowDown');
        await expect(listView.marker({ index: 1 })).not.toBeDisplayed();
        await expect(listView.marker({ index: 2 })).toBeDisplayed();
        // Текст не должен поменяться, т.к. события клика не было
        await expect(itemClickBasePage.eventsLogPanel()).toHaveText(
            eventsLogPanelText
        );

        await browser.keys('Enter');
        eventsLogPanelText =
            'Выполнили клик по key: 1; активировали item-key: 1';
        await expect(itemClickBasePage.eventsLogPanel()).toHaveText(
            eventsLogPanelText
        );
        await expect(listView.marker({ index: 2 })).toBeDisplayed();
    });
});
