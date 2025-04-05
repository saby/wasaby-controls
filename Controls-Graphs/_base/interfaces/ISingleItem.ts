/**
 * @public
 * @interface Controls-Graphs/_base/interfaces/ISingleItem
 * Интерфейс, представляющий собой описание 1 объекта(без конкретных полей) из массива данных, которые будут отрисованы графиком.
 * @example
 * В данном случае столбчатый график отрисует 2 серии данных(y и z), каждая из которых состоит из 4 точек.
 * <pre brush="brush: js">
 *  const data: ISingleItem[] = [
 *     { x: 10, y: 20, z: 30 },
 *     { x: 20, y: 40, z: 60 },
 *     { x: 30, y: 60, z: 90 },
 *     { x: 40, y: 80, z: 120 },
 *  ];
 *  const series: ISingleSeriesItem[] = [
 *     { name: 'y', xValueProperty: 'x', valueProperty: 'y' }
 *     { name: 'z', xValueProperty: 'x', valueProperty: 'z' }
 *  ];
 *  return <ColumnChart data={data} series={series} />
 * </pre>
 */
export default interface ISingleItem {
    [key: string]: unknown;
}
