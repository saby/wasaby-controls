import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Paging/End/ContentTemplate/ContentTemplate';
import { CrudEntityKey, Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

const MAX_ELEMENTS_COUNT: number = 100;
const SCROLL_TO_ITEM: number = 95;

function getData() {
    return generateData({
        count: MAX_ELEMENTS_COUNT,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });
}

/**
 * Отображение пейджинга с одной командой прокрутки.
 * Отображается только кнопка в конец, а также произвольный шаблон.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _textInfo: string = '';
    protected _count: number;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationPagingEndContentTemplate: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 99,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'end',
                        },
                    },
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._count = MAX_ELEMENTS_COUNT - 1;
    }

    /**
     * Обновляем количество непрочитанных записей
     * @param {SyntheticEvent} e
     * @param {EntityKey} key
     * @private
     */
    protected _updateCount(e: SyntheticEvent, key: CrudEntityKey): void {
        this._count = MAX_ELEMENTS_COUNT - 1 - Number(key);
    }

    /**
     * Обрабатываем нажатие на кнопку пэйджинга, и всегда скролим к определенному элементу списка
     * @param {SyntheticEvent} event
     * @param {string} arrow
     * @return {boolean}
     * @private
     */
    protected _onPagingArrowClick(event: SyntheticEvent, arrow: string): boolean {
        switch (arrow) {
            case 'End':
                this._textInfo = `Нажали кнопку "в конец" скролим к ${SCROLL_TO_ITEM} элементу`;
                break;
        }
        this._children.list.scrollToItem(SCROLL_TO_ITEM, 'bottom', true);
        return false;
    }

    protected _clear(): void {
        this._textInfo = '';
    }
}
