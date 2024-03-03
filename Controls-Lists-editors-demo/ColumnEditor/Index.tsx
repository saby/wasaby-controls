import { ColumnsEditorOpener, IColumnsEditorResult } from 'Controls-Lists-editors/columnsEditor';
import { default as GridConnectedComponentTypeMeta } from 'Controls-Lists-meta/gridConnectedComponent';
import { Memory } from 'Types/source';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { getColumns, getHeader, newGetData } from './DemoData';
import 'Controls-Lists-editors-demo/ColumnEditor/DemoWidget';
import * as React from 'react';
import 'Controls-Lists-editors/columnsEditor';
import * as modulesLoader from 'WasabyLoader/ModulesLoader';

const loadAsyncBase = modulesLoader.loadAsync;

class PluginClipboard {
    getData() {
        return Promise.resolve('');
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
modulesLoader.loadAsync = (name: string) => {
    if (name === 'Clipboard/Plugin') {
        return Promise.resolve(PluginClipboard);
    } else {
        return loadAsyncBase(name);
    }
};

export default React.forwardRef(function ColumnEditorDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const editorDialog = new ColumnsEditorOpener({});
    const columns: TColumnsForCtor = getColumns();
    const header: THeaderForCtor = getHeader();
    const [result, setResult] = React.useState<IColumnsEditorResult>({
        columns,
        header,
    });
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
                        eventHandlers: {
                            onResult: (resultPromise: Promise<IColumnsEditorResult>) => {
                                resultPromise.then((data: IColumnsEditorResult) => {
                                    setResult(data);
                                });
                            },
                        },
                    });
                }}
            >
                Настройки
            </button>
            <div>{JSON.stringify(result)}</div>
        </div>
    );
});
