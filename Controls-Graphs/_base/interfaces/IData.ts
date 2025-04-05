import ISingleItem from './ISingleItem';

/**
 * @public
 * @interface Controls-Graphs/_base/interfaces/IData
 */
export default interface IData {
    /**
     * @name Controls-Graphs/_base/interfaces/IData#data
     * @cfg {ISingleItem[]} Данные, приходящие в график.
     * @see Controls-Graphs/_base/interfaces/ISingleItem
     */
    data: ISingleItem[];
}
