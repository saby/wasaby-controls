/**
 * Интерфейс, описывающий объект с конфигурацией 1 серии данных.
 * @public
 * @example
 * В данном случае столбчатый график отрисует 2 серии данных(y и z), каждая из которых состоит из 4 точек.
 * Первая серия будет иметь цвет соответствующий base-1001(из палитрый цветов графиков), вторая серия base-1003.
 * <pre brush="brush: js">
 *  const data: ISingleItem[] = [
 *     { x: 10, y: 20, z: 30 },
 *     { x: 20, y: 40, z: 60 },
 *     { x: 30, y: 60, z: 90 },
 *     { x: 40, y: 80, z: 120 },
 *  ];
 *  const series: ISingleSeriesItem[] = [
 *     { name: 'y', xValueProperty: 'x', valueProperty: 'y', colorIndex: 1 }
 *     { name: 'z', xValueProperty: 'x', valueProperty: 'z', colorIndex: 3 }
 *  ];
 *  return <ColumnChart data={data} series={series} />
 * </pre>
 */
export default interface ISingleSeriesItem {
    /**
     * Имя поля, по которому будет формироваться объект с данными для отображения на графике.
     * @example
     * В данном случае для первой серии данные будут браться из поля data[i]['y']. Для второй серии из data[i]['z'].
     * <pre brush="brush: js">
     *  const data: ISingleItem[] = [
     *     { x: 10, y: 20, z: 30 },
     *     { x: 20, y: 40, z: 60 },
     *     { x: 30, y: 60, z: 90 },
     *     { x: 40, y: 80, z: 120 },
     *  ];
     *  const series: ISingleSeriesItem[] = [
     *     { name: 'y', xValueProperty: 'x', valueProperty: 'y', colorIndex: 1 }
     *     { name: 'z', xValueProperty: 'x', valueProperty: 'z', colorIndex: 3 }
     *  ];
     *  return <ColumnChart data={data} series={series} />
     * </pre>
     */
    valueProperty: string;
    /**
     * Имя поля в объекте с данными, по которому будут формироваться подписи к частям диаграммы.
     * @example
     * В данном случае подписи будут формироваться исходя из поля data[i]['label'].
     * <pre brush="brush: js">
     *  const data: ISingleItem[] = [
     *     { label: 'Данные 1', value: 33 },
     *     { label: 'Данные 2', value: 33 },
     *     { label: 'Данные 3', value: 33 },
     *  ];
     *  const series: ISingleSeriesItem[] = [
     *     { name: 'Данные', displayProperty: 'label', valueProperty: 'value' }
     *  ];
     *  return <RoundChart data={data} series={series} />
     *  @remark Актуально для круговой диаграммы.
     * </pre>
     */
    displayProperty?: string;
    /**
     * Номер цвета.
     */
    colorIndex?: number;
    /**
     * Название поля в объекте с данными, согласно которому будет формироваться цвет частей диаграммы.
     * @default colorIndex
     * @remark Актуально только для круговой диаграммы.
     * @example
     * В данном случае круговая диаграмма отобразит 3 сектора, с цветами base-1001, base-1002, base-1003.
     * <pre brush="brush: js">
     *  const data: ISingleItem[] = [
     *     { x: 10, color: 1, text: 'Данные 1' },
     *     { x: 20, color: 2, text: 'Данные 2' },
     *     { x: 30, color: 3, text: 'Данные 3' },
     *  ];
     *  const series: ISingleSeriesItem[] = [
     *     { name: 'x', displayProperty: 'text', colorProperty: 'y' }
     *  ];
     *  return <RoundChart data={data} series={series} />
     * </pre>
     */
    colorProperty?: string;
    /**
     * Порядковый номер стэка. Эта опция позволяет сгруппировать серии на графике в виде стека.
     * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series/stack/ Пример}
     * @remark Актуально только для столбчатой диаграммы.
     */
    stack?: number;
    /**
     * Индекс оси Y, к которой будет привязана серия данных.
     * @remark Только для случая когда 2 оси Y.
     */
    yAxis?: number;
    /**
     * Название поля в объекте с данными, согласно которому будет формироваться текст подписей по оси X.
     * @example
     * В данном случае для 4 точек графика будет 4 подписи = ['Январь', 'Февраль', 'Март', 'Апрель']
     * <pre brush="brush: js">
     *  const data: ISingleItem[] = [
     *     { x: 'Январь', y: 20, z: 30 },
     *     { x: 'Февраль', y: 40, z: 60 },
     *     { x: 'Март', y: 60, z: 90 },
     *     { x: 'Апрель', y: 80, z: 120 },
     *  ];
     *  const series: ISingleSeriesItem[] = [
     *     { name: 'y', xValueProperty: 'x', valueProperty: 'y', colorIndex: 1 }
     *     { name: 'z', xValueProperty: 'x', valueProperty: 'z', colorIndex: 3 }
     *  ];
     *  return <ColumnChart data={data} series={series} />
     * </pre>
     */
    xValueProperty?: string;
    /**
     * Название серии которое будет отображено в тултипе и легенде.
     */
    name?: string;
    /**
     * Имя поля в объекте с данными, по которому будут формироваться подсказки на круговом диаграмме с типом pie.
     */
    labelProperty?: string;
}
