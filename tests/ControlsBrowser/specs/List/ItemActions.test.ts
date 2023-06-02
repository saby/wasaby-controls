import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import Menu from '../../elements/popup/Menu';
import Page from '../../pages/list_new/ItemActionClickHandler.page';

describe('Controls/list:View - ItemActions', () => {
    let listView: ListView;
    let menu: Menu;
    let page: Page;

    beforeEach(() => {
        listView = new ListView();
        menu = new Menu();
        page = new Page();
    });

    // FIXME: огромный сценарий, вряд ли он нужен в таком виде
    it('клик по операциям над записью обрабатывается', async () => {
        // TestVDOMListActions.test_01_action
        await openPage(
            'Controls-demo/list_new/ItemActions/ItemActionClickHandler/Index'
        );

        await listView.selectItemAction(
            {
                index: 1,
            },
            {
                title: 'Прочитано',
            }
        );

        await expect(page.result()).toHaveText(
            'У операции "Прочитано" отдельный обработчик. Элемент с id=0.'
        );

        await listView.selectItemAction(
            {
                index: 2,
            },
            {
                title: 'Позвонить',
            }
        );

        await expect(page.result()).toHaveText(
            'Кликнули на операцию "Позвонить" у элемента с id="1".'
        );

        await listView.selectItemAction(
            {
                index: 3,
            },
            {
                title: 'Написать',
            }
        );

        await expect(menu.head()).toHaveText('НАПИСАТЬ', {
            ignoreCase: true,
        });
        await expect(
            menu.item({
                text: 'Email',
            })
        ).toBeDisplayed();

        await menu
            .item({
                text: 'Диалог',
            })
            .click();

        await expect(menu.container()).not.toExist();
        await expect(page.result()).toHaveText(
            'Кликнули на операцию "Диалог" у элемента с id="2".'
        );

        await listView.selectItemAction(
            {
                index: 4,
            },
            {
                title: 'Написать',
            }
        );
        await menu.select({
            text: 'Email',
        });

        await expect(menu.container()).not.toExist();
        await expect(page.result()).toHaveText(
            'Кликнули на операцию "Email" у элемента с id="3".'
        );

        await listView.selectItemAction(
            {
                index: 3,
            },
            {
                iconClass: 'icon-SettingsNew',
            }
        );
        await menu.select({
            text: 'Позвонить',
        });

        await expect(menu.container()).not.toExist();
        await expect(page.result()).toHaveText(
            'Кликнули на операцию "Позвонить" у элемента с id="2".'
        );

        await listView.selectItemAction(
            {
                index: 4,
            },
            {
                iconClass: 'icon-SettingsNew',
            }
        );
        await menu.select({
            text: 'Профиль пользователя',
        });

        await expect(menu.container()).not.toExist();
        await expect(page.result()).toHaveText(
            'Кликнули на операцию "Профиль пользователя" у элемента с id="3".'
        );

        await listView.selectItemAction(
            {
                index: 2,
            },
            {
                iconClass: 'icon-SettingsNew',
            }
        );
        await menu.select({
            text: 'Удалить',
        });

        await expect(menu.container()).not.toExist();
        await expect(page.result()).toHaveText(
            'Кликнули на операцию "Удалить" у элемента с id="1".'
        );
    });
});
