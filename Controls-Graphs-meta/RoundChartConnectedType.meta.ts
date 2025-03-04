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

const CONNECTED_PROP_NAME = 'name';
const FIELDS_TITLE = translate('Измерение');
const FORMAT_TITLE = translate('Формат');
const SERIES_TITLE = translate('Показатели');
const ORDERS = {
    NAME_EDITOR: 0,
    FIELDS: 1,
    FORMAT: 2,
    SERIES: 3,
    DIAGRAM_SETTING: 4,
    LEGEND_HORIZONTAL_ALIGNMENT: 5,
    LEGEND_VERTICAL_POSITION: 6,
};

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
        type: StringType.title('').hidden().defaultValue('donut'),
        size: StringType.title('').hidden().defaultValue('m'),
        reset: StringType.title('')
            .editor('Controls-Graphs-editors/RoundChartResetEditor:RoundChartResetEditor')
            .editorProps({
                connectedPropName: CONNECTED_PROP_NAME,
            }),
        ...group('', {
            name: INameOptionsType.editorProps({
                fieldType: [FieldTypes.DataSet],
                excludedEditors: ['fields'],
                labelProperty: ['widgetTitle'],
            }).order(ORDERS.NAME_EDITOR),
        }),
        ...group('', {
            fields: StringType.title(FIELDS_TITLE)
                .editor('Controls-Graphs-editors/RoundChartColumnEditor:RoundChartColumnEditor')
                .editorProps({
                    connectedPropName: CONNECTED_PROP_NAME,
                })
                .order(ORDERS.FIELDS)
                .optional(),
            format: StringType.title(FORMAT_TITLE)
                .editor('Controls-Graphs-editors/FormatEditor:FormatEditor')
                .editorProps({
                    connectedPropName: CONNECTED_PROP_NAME,
                })
                .order(ORDERS.FORMAT)
                .optional()
                .hidden(),
        }),
        ...extended(
            group('', {
                series: SeriesOptionsType.title(SERIES_TITLE)
                    .editor('Controls-Graphs-editors/RoundChartSeriesEditor:RoundChartSeriesEditor')
                    .order(ORDERS.SERIES),
            })
        ),
        ...group('', {
            diagramSettings: StringType.title('')
                .editor('Controls-Graphs-editors/RoundChartDiagramEditor:RoundChartDiagramEditor')
                .order(ORDERS.DIAGRAM_SETTING)
                .editorProps({
                    connectedPropName: CONNECTED_PROP_NAME,
                }),
        }),
        ...extended(
            group(translate('Легенда'), {
                legendVisible: BooleanType.editor(
                    'Controls-Graphs-editors/LegendVisibleEditor:LegendVisibleEditor'
                )
                    .optional()
                    .defaultValue(false),
                legendHorizontalAlignment: StringType.title(translate('По горизонтали'))
                    .editor(
                        'Controls-Graphs-editors/LegendHorizontalPositionEditor:LegendHorizontalPositionEditor'
                    )
                    .order(ORDERS.LEGEND_HORIZONTAL_ALIGNMENT)
                    .optional(),
                legendVerticalPosition: StringType.title(translate('По вертикали'))
                    .editor(
                        'Controls-Graphs-editors/LegendVerticalPositionEditor:LegendVerticalPositionEditor'
                    )
                    .order(ORDERS.LEGEND_VERTICAL_POSITION)
                    .optional(),
            })
        ),
    })
    .designtimeEditor('Controls-Graphs-editors/DataSetFieldSeriesDesignTimeEditor');

export default RoundChartConnectedType;
