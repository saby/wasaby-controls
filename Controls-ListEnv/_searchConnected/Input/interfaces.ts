import { IContextOptionsValue } from 'Controls/context';
import { ISearchInputContainerOptions } from 'Controls/search';

/**
 * Опции виджета строки поиска
 * @private
 */
export interface ISearchInputOptions extends ISearchInputContainerOptions {
    /**
     * @cfg {string} Идентификатор списка с которым связан виджет поиска.
     */
    storeId: string | number;

    _dataOptionsValue: IContextOptionsValue;
}
