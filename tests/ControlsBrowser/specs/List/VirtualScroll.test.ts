import { openPage } from '../../helpers/openPage';
import ListView from '../../elements/list/View';
import Paging from '../../elements/list/Paging';
import Scroll from '../../elements/scroll/Container';
import VirtualScrollContainerPage from '../../pages/list_new/VirtualScrollContainer.page';
import ConstantHeightsScrollToItemPage from '../../pages/list_new/ConstantHeightsScrollToItem.page';
import { scrollList } from '../../helpers/scrollList';

describe('Controls/list:View - VirtualScroll', () => {
    let listView: ListView;
    let virtualScrollContainerPage: VirtualScrollContainerPage;
    let constantHeightsScrollToItemPage: ConstantHeightsScrollToItemPage;
    let paging: Paging;
    let scroll: Scroll;

    beforeEach(() => {
        listView = new ListView();
        virtualScrollContainerPage = new VirtualScrollContainerPage();
        constantHeightsScrollToItemPage = new ConstantHeightsScrollToItemPage();
        paging = new Paging();
        scroll = new Scroll();
    });

    it('контент, расположенный над списком, должен исчезать/появляться при скролле', async () => {
        // TestVDOMVirtualScrollDisplayContent.test_01_removing_content
        await openPage(
            'Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Index'
        );

        await scrollList(listView, 'Запись #', 19, 101, 5);

        await listView
            .item({
                text: 'Запись #100',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                text: 'Запись #100',
            })
        ).toBeDisplayed();
        await expect(
            virtualScrollContainerPage.listTopBlock()
        ).not.toBeDisplayed();

        await scrollList(listView, 'Запись #', 100, -1, -5);

        await expect(virtualScrollContainerPage.listTopBlock()).toBeDisplayed();
    });

    it('При скролле данные удаляются и добавляются в DOM', () => {
        return async () => {
            // TestVDOMVirtualScrollDisplayContent.test_03_content_top_and_bottom
            await openPage(
                'Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Both/Index'
            );

            await listView.container().moveTo();

            await scrollList(listView, 'Запись #', 19, 101, 5);

            await listView
                .item({
                    text: 'Запись #100',
                })
                .scrollIntoView();

            await expect(
                listView.item({
                    text: 'Запись #100',
                })
            ).toBeDisplayed();
            await expect(
                virtualScrollContainerPage.listTopBlock()
            ).not.toBeDisplayed();
            await expect(
                virtualScrollContainerPage.listBottomBlock()
            ).not.toBeDisplayed();

            await scrollList(listView, 'Запись #', 104, 200, 5);
            await expect(
                virtualScrollContainerPage.listTopBlock()
            ).not.toBeDisplayed();
            await expect(
                virtualScrollContainerPage.listBottomBlock()
            ).toBeDisplayed();

            // Возвращаемся в самое начало
            await paging.begin().click();
            await expect(
                virtualScrollContainerPage.listTopBlock()
            ).toBeDisplayed();
            await expect(
                virtualScrollContainerPage.listBottomBlock()
            ).not.toBeDisplayed();
        };
    });

    it('эмуляция скролла контактов', async () => {
        // TestVDOMVirtualScroll2.test_02_list_contacts
        await openPage(
            'Controls-demo/list_new/VirtualScroll/DifferentHeights/Contacts/Index'
        );

        await expect(
            listView.item({
                textContaining: 'Запись с id="19".',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с id="0".',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с id="20".',
            })
        ).not.toExist();

        await listView
            .item({
                textContaining: 'Запись с id="19".',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с id="0".',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с id="39".',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с id="40".',
            })
        ).not.toExist();

        await listView
            .item({
                textContaining: 'Запись с id="39".',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с id="60".',
            })
        ).not.toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с id="59".',
            })
        ).toExist();
    });

    it('Эмуляция скролдла в реестре задач', async () => {
        // TestVDOMVirtualScroll2.test_03_list_tasks
        await openPage(
            'Controls-demo/list_new/VirtualScroll/DifferentHeights/Tasks/Index'
        );

        await expect(
            listView.item({
                textContaining: 'Запись с id="0".',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с id="19".',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с id="20".',
            })
        ).not.toBeDisplayed();

        await listView
            .item({
                textContaining: 'Запись с id="19".',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с id="19".',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с id="0".',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с id="39".',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с id="40".',
            })
        ).not.toBeDisplayed();

        await listView
            .item({
                textContaining: 'Запись с id="39".',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с id="9".',
            })
        ).not.toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с id="10".',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с id="39".',
            })
        ).toExist();
    });

    it('виртуальный скроллинг работает на записях с одинаковыми высотами', async () => {
        // TestVDOMVirtualScroll1.test_01_default_options
        await openPage(
            'Controls-demo/list_new/VirtualScroll/ConstantHeights/Default/Index'
        );

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 0.',
            })
        ).toBeDisplayed();

        await listView.container().moveTo();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 20.',
            })
        ).not.toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 19.',
            })
        ).toExist();

        await listView
            .item({
                textContaining: 'Запись с ключом 17.',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 25.',
            })
        ).not.toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 24.',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 4.',
            })
        ).not.toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 5.',
            })
        ).toExist();
    });

    // В оригинальном тесте скроллили при помощи прямого обращения к методу scrollToTop() контрола скролла
    // Публичные методы должны тестироваться в JEST, заменил тут на скролл к триггеру
    it('виртуальный скроллинг работает на записях малой высоты', async () => {
        // TestVDOMVirtualScroll1.test_02_small_records
        await openPage(
            'Controls-demo/list_new/VirtualScroll/ConstantHeights/SmallDialog/Index'
        );

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 999.',
            })
        ).toBeDisplayed();

        await listView
            .item({
                textContaining: 'Запись с ключом 999.',
            })
            .moveTo();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 979.',
            })
        ).not.toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 980.',
            })
        ).toExist();

        await scroll.trigger('top').scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 980.',
            })
        ).toBeDisplayed();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 960.',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 959.',
            })
        ).not.toExist();

        await scroll.trigger('top').scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 960.',
            })
        ).toBeDisplayed();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 950.',
            })
        ).toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 949.',
            })
        ).not.toExist();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 989.',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 990.',
            })
        ).not.toBeDisplayed();
    });

    it('работает подскролл к записи при виртуальном скроллинге', async () => {
        // TestVDOMVirtualScroll1.test_06_scroll_to_record
        await openPage(
            'Controls-demo/list_new/VirtualScroll/ConstantHeights/ScrollToItem/Index'
        );

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 15.',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 0.',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 22.',
            })
        ).not.toBeDisplayed();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 21.',
            })
        ).toBeDisplayed();

        // FIXME if not BrowserNames.is_ie():
        await listView.container().moveTo();

        // Блок проверок с подскроллом к записи с индексом 7
        const scrollToSeventhAndCheck = async (): Promise<void> => {
            await constantHeightsScrollToItemPage.scrollToSeventhRecord();

            await expect(scroll.shadow('top')).toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 0.',
                })
            ).not.toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 1.',
                })
            ).toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 29.',
                })
            ).not.toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 28.',
                })
            ).toBeDisplayed();
        };

        await expect(scroll.shadow('bottom')).toBeDisplayed();

        await scrollToSeventhAndCheck();

        // Скроллим записи с подгрузкой вниз
        await listView
            .item({
                textContaining: 'Запись с ключом 28.',
            })
            .scrollIntoView();
        await listView
            .item({
                textContaining: 'Запись с ключом 34.',
            })
            .scrollIntoView();
        await listView
            .item({
                textContaining: 'Запись с ключом 40.',
            })
            .scrollIntoView();
        await listView
            .item({
                textContaining: 'Запись с ключом 46.',
            })
            .scrollIntoView();
        await listView
            .item({
                textContaining: 'Запись с ключом 50.',
            })
            .scrollIntoView();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 50.',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 7.',
            })
        ).not.toBeDisplayed();

        await scrollToSeventhAndCheck();
    });

    it('работает подгрузка вниз', async () => {
        // TestVDOMVirtualScroll1.test_07_down_scroll
        await openPage(
            'Controls-demo/list_new/VirtualScroll/ConstantHeights/OneLoadOnInit/Down/Index'
        );

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 0.',
            })
        ).toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 30.',
            })
        ).not.toBeDisplayed();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 29.',
            })
        ).toExist();
        await listView
            .item({
                textContaining: 'Запись с ключом 29.',
            })
            .scrollIntoView();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 29.',
            })
        ).toBeDisplayed();

        await expect(
            listView.item({
                textContaining: 'Запись с ключом 40.',
            })
        ).not.toBeDisplayed();
        await expect(
            listView.item({
                textContaining: 'Запись с ключом 39.',
            })
        ).toBeDisplayed();
    });

    describe('Списки без источника данных', () => {
        it('работает виртуальный скроллинг', async () => {
            // TestVDOMListView.test_08_no_sources_virtual
            await openPage(
                'Controls-demo/list_new/ItemsView/VirtualScroll/ConstantHeights/Default/Index'
            );

            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 0.',
                })
            ).toBeDisplayed();

            await listView.container().moveTo();

            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 20.',
                })
            ).not.toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 19.',
                })
            ).toExist();

            await listView
                .item({
                    textContaining: 'Запись с ключом 17.',
                })
                .scrollIntoView();

            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 25.',
                })
            ).not.toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 24.',
                })
            ).toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 4.',
                })
            ).not.toBeDisplayed();
            await expect(
                listView.item({
                    textContaining: 'Запись с ключом 5.',
                })
            ).toExist();
        });
    });
});
