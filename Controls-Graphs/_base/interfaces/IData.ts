import ISingleItem from './ISingleItem';

/**
 * Интерфейс, описывающий данные, приходящие в график.
 * @public
 */
export default interface IData {
    /**
     * Данные, приходящие в график.
     */
    data: ISingleItem[];
}
