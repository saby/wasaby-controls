import { Opener, IColumnsProps } from 'Controls-Lists-editors/columnsEditor';
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
    const editorDialog = new Opener();
    const columns: TColumnsForCtor = getColumns();
    const header: THeaderForCtor = getHeader();
    const installationColumns: React.MutableRefObject<TColumnsForCtor> = React.useRef(getColumns());
    const installationHeader: React.MutableRefObject<THeaderForCtor> = React.useRef(getHeader());
    const [result, setResult] = React.useState<IColumnsProps>({
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
                data-qa={'Controls-Lists-editors-demo_ColumnEditor__settings'}
                onClick={() => {
                    editorDialog.open({
                        value: {
                            columns,
                            header,
                        },
                        onChange: (value: IColumnsProps) => {
                            setResult(value);
                        },
                        editorProps: {
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
                                )
                                .defaultValue({
                                    columns: installationColumns.current,
                                    header: installationHeader.current,
                                }),
                            widget: 'Controls-Lists-editors-demo/ColumnEditor/DemoWidget',
                            widgetProps: {},
                        },
                    });
                }}
            >
                Настройки
            </button>
            <div data-qa={'Controls-Lists-editors-demo_ColumnEditor__result'}>
                {JSON.stringify(result)}
            </div>
        </div>
    );
});
