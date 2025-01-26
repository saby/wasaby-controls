/**
 * Интерфейс, описывающий название поля, при обращении к которому из опции data будут отбиратся данные.
 * @example
 * const data = [
 *    {
 *       myData: [100, 200, ...]
 *    }
 * ]
 * <Graph valueProperty='myData' data={data}>
 */
export default interface IValueProperty {
    valueProperty?: string;
}
