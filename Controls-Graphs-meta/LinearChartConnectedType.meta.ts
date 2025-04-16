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
import * as translate from 'i18n!Controls-Graphs';

const SoloSeriesOptionsType = ObjectType.properties({
    valueProperty: StringType.hidden(),
    name: StringType.hidden(),
    colorIndex: StringType.hidden(),
});

const SeriesOptionsType = ArrayType.of(SoloSeriesOptionsType);

const LinearChartConnectedType = WidgetType.id('Controls-Graphs/LinearChartConnected')
    .title('Линейный')
    .category('График')
    .relatedObjects(['Widget'])
    .properties({
        name: INameOptionsType.editorProps({
            fieldType: [FieldTypes.DataSet],
            excludedEditors: ['fields'],
            labelProperty: ['widgetTitle'],
        }).order(0),
        reset: StringType.title('')
            .editor('Controls-Graphs-editors/LinearChartResetEditor:LinearChartResetEditor')
            .editorProps({
                connectedPropName: 'name',
            })
            .order(1),
        fields: StringType.title(translate('Измерение'))
            .editor('Controls-Graphs-editors/ColumnEditor:ColumnEditor')
            .editorProps({
                connectedPropName: 'name',
            })
            .order(2)
            .optional(),
        format: StringType.title(translate('Формат'))
            .editor('Controls-Graphs-editors/FormatEditor:FormatEditor')
            .editorProps({
                connectedPropName: 'name',
            })
            .order(3)
            .optional()
            .hidden(),
        series: SeriesOptionsType.title(translate('Показатели'))
            .editor('Controls-Graphs-editors/SeriesEditor:SeriesEditor')
            .defaultValue([])
            .order(4),
        ...extended(
            group(translate('Легенда'), {
                legendVisible: BooleanType.editor(
                    'Controls-Graphs-editors/LegendVisibleEditor:LegendVisibleEditor'
                )
                    .order(5)
                    .optional()
                    .defaultValue(false),
                legendHorizontalAlignment: StringType.title(translate('По горизонтали'))
                    .editor(
                        'Controls-Graphs-editors/LegendHorizontalPositionEditor:LegendHorizontalPositionEditor'
                    )
                    .order(6)
                    .optional()
                    .defaultValue('center'),
                legendVerticalPosition: StringType.title(translate('По вертикали'))
                    .editor(
                        'Controls-Graphs-editors/LegendVerticalPositionEditor:LegendVerticalPositionEditor'
                    )
                    .order(7)
                    .optional()
                    .defaultValue('top'),
            })
        ),
    })
    .designtimeEditor('Controls-Graphs-editors/DataSetFieldSeriesDesignTimeEditor');

export default LinearChartConnectedType;
