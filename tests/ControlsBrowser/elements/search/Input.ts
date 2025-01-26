import BaseElement from '../BaseElement';

interface ISearchOptions {
    /**
     * Искомая строка.
     */
    searchString: string;
    /**
     * Нажимать ли на кнопку поиска
     */
    searchButtonClick?: boolean;
}

/**
 * Строка поиска
 * @author Зайцев А.С.
 */
export default class SearchInput extends BaseElement {
    constructor(selector: string = '.controls-Render') {
        super(selector);
    }

    input(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('.controls-search input');
    }

    searchButton(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="Search__searchButton"]');
    }

    resetButton(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('[data-qa="Search__resetButton"]');
    }

    async search({ searchString, searchButtonClick = false }: ISearchOptions): Promise<void> {
        await this.input().addValue(searchString);
        if (searchButtonClick) {
            await this.searchButton().click();
        }
    }
}
