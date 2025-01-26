import {
    WidgetType,
    StringType,
    group,
    extended,
    BooleanType,
    ArrayType,
    ObjectType,
} from 'Meta/types';
import { FieldTypes, INameOptionsType } from 'Controls-Input-meta/interface';

const SoloSeriesOptionsType = ObjectType.properties({
    valueProperty: StringType.hidden(),
    name: StringType.hidden(),
    colorIndex: StringType.hidden(),
});

const SeriesOptionsType = ArrayType.of(SoloSeriesOptionsType);

const RoundChartConnectedType = WidgetType.id('Controls-Graphs/RoundChartConnected')
    .title('Круговой')
    .category('График')
    .relatedObjects(['Widget'])
    .properties({
        ...group('', {
            name: INameOptionsType.editorProps({
                fieldType: [FieldTypes.DataSet],
                excludedEditors: ['fields'],
                placeholder: 'Выберите датасет',
                labelProperty: ['widgetTitle'],
            }).order(0),
        }),
        ...group('', {
            fields: StringType.title('Измерение')
                .editor('Controls-Graphs-editors/LinearChartColumnEditor:LinearChartColumnEditor')
                .editorProps({
                    connectedPropName: 'name',
                })
                .order(1)
                .optional(),
            format: StringType.title('Формат')
                .editor('Controls-Graphs-editors/FormatEditor:FormatEditor')
                .editorProps({
                    connectedPropName: 'name',
                })
                .order(2)
                .optional(),
        }),
        ...extended(
            group('', {
                series: SeriesOptionsType.title('Показатели')
                    .editor('Controls-Graphs-editors/SeriesEditor:SeriesEditor')
                    .defaultValue([])
                    .order(3),
            })
        ),
        ...extended(
            group('Легенда', {
                legendVisible: BooleanType.editor(
                    'Controls-Graphs-editors/LegendVisibleEditor:LegendVisibleEditor'
                )
                    .order(4)
                    .optional()
                    .defaultValue(false),
                legendHorizontalAlignment: StringType.title('По горизонтали')
                    .editor(
                        'Controls-Graphs-editors/LegendHorizontalPositionEditor:LegendHorizontalPositionEditor'
                    )
                    .order(5)
                    .optional()
                    .defaultValue('center'),
                legendVerticalPosition: StringType.title('По вертикали')
                    .editor(
                        'Controls-Graphs-editors/LegendVerticalPositionEditor:LegendVerticalPositionEditor'
                    )
                    .order(6)
                    .optional()
                    .defaultValue('top'),
            })
        ),
    })
    .designtimeEditor('Controls-Graphs-editors/DataSetFieldSeriesDesignTimeEditor');

export default RoundChartConnectedType;
