import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IArrowState } from 'Controls/paging';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/PagingNavigation/OtherControl';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

const MAX_ELEMENTS_COUNT: number = 50;

function getData() {
    return generateData({
        count: MAX_ELEMENTS_COUNT,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });
}

/**
 * Подключение пэйджинга к произвольному шаблону
 */
export default class extends Control {
    static _styles: string[] = ['Controls-ListEnv-demo/Search/List/PagingNavigation/styles'];
    protected _template: TemplateFunction = Template;
    private _arrowState: IArrowState;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationPagingOtherControl: {
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
                            pageSize: 50,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            showEndButton: true,
                            pagingMode: 'hidden',
                        },
                    },
                },
            },
        };
    }

    /**
     * Контролируем состояние кнопок в начало/конец.
     * @param {SyntheticEvent} event
     * @param {EntityKey} key
     * @private
     */
    _updatePagingArrow(event: SyntheticEvent, key: CrudEntityKey): void {
        /**
         * Если виден 1 элемент, то переводим кнопку в начало в состояние "readonly"
         */
        if (key > 0) {
            this._arrowState.begin = 'visible';
        } else {
            this._arrowState.begin = 'readonly';
        }
        /**
         * Если виден последний элемент, то переводим кнопку в конец в состояние "readonly"
         */
        if (key === '49') {
            this._arrowState.end = 'readonly';
        } else {
            this._arrowState.end = 'visible';
        }
        this._arrowState = { ...this._arrowState };
    }

    protected _beforeMount(): void {
        this._arrowState = {
            begin: 'readonly',
            next: 'hidden',
            prev: 'hidden',
            end: 'visible',
        };
    }

    /**
     * Обрабатываем нажатие на кнопки
     * @param {SyntheticEvent} event
     * @param {string} arrow
     * @return {boolean}
     * @private
     */
    protected _onPagingArrowClick(event: SyntheticEvent, arrow: string): boolean {
        switch (arrow) {
            case 'Begin':
                this._children.list.scrollToItem(0, 'bottom', true);
                this._arrowState.begin = 'readonly';
                this._arrowState.end = 'visible';
                break;
            case 'End':
                this._children.list.scrollToItem(MAX_ELEMENTS_COUNT - 1, 'bottom', true);
                this._arrowState.begin = 'visible';
                this._arrowState.end = 'readonly';
                break;
        }
        this._arrowState = { ...this._arrowState };
        return false;
    }
}
