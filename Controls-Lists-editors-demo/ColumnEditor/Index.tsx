import { ColumnsEditorOpener } from 'Controls-Lists-editors/columnsEditor';
import { default as GridConnectedComponentTypeMeta } from 'Controls-Lists-meta/gridConnectedComponent';
import { Memory } from 'Types/source';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { getColumns, getHeader, newGetData } from './DemoData';
import 'Controls-Lists-editors-demo/ColumnEditor/DemoWidget';
import * as React from 'react';
import 'Controls-Lists-editors/columnsEditor';

export default React.forwardRef(function ColumnEditorDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const editorDialog = new ColumnsEditorOpener({});
    const columns: TColumnsForCtor = getColumns();
    const header: THeaderForCtor = getHeader();
    const bindings = React.useMemo(() => {
        return {
            contextConfig: {
                GridWidgetSlice: {
                    dataFactoryName: 'Controls/dataFactory:List',
                    dataFactoryArguments: {
                        displayProperty: 'title',
                        source: new Memory({
                            keyProperty: 'key',
                            data: newGetData(),
                        }),
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        nodeProperty: 'type',
                        columns,
                        header,
                    },
                },
            },
        };
    }, []);
    return (
        <div style={{ width: '100px' }} ref={ref}>
            <button
                onClick={() => {
                    editorDialog.open({
                        widget: 'Controls-Lists-editors-demo/ColumnEditor/DemoWidget',
                        widgetProps: {},
                        columns,
                        header,
                        bindings,
                        objectName: 'ProcessingPlanned',
                        widgetMetaType: GridConnectedComponentTypeMeta.id(
                            'Controls-Lists-editors-demo/ColumnEditor/DemoWidget'
                        )
                            .title('DemoGridWidget (вместо прикладного виджета)')
                            .designtimeEditor(
                                'Controls-Lists-editors/columnsEditor:ColumnsDesignTimeEditor',
                                {},
                                true
                            ),
                    });
                }}
            >
                Настройки
            </button>
        </div>
    );
});
