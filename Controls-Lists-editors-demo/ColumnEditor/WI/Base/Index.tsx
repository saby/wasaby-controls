import * as React from 'react';
import { Opener, IColumnsEditorValue } from 'Controls-Lists-editors/columnsEditor';
import {
    getColumns,
    getHeader,
    newGetData,
} from 'Controls-Lists-editors-demo/ColumnEditor/DemoData';
import { default as GridConnectedComponentTypeMeta } from 'Controls-Lists-meta/gridConnectedComponent';
import { Memory } from 'Types/source';
import { Container } from 'Controls/scroll';
import { View } from 'Controls/treeGrid';
import { Button } from 'Controls/buttons';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/baseGrid';

const Base = React.forwardRef(function BaseDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const [result, setResult] = React.useState<IColumnsEditorValue>({
        columns: getColumns(),
        header: getHeader(),
    });
    const installationColumns: React.MutableRefObject<TColumnsForCtor> = React.useRef(getColumns());
    const installationHeader: React.MutableRefObject<THeaderForCtor> = React.useRef(getHeader());
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
                        columns: result.columns,
                        header: result.header,
                    },
                },
            },
        };
    }, [result]);

    const openEditor = React.useCallback(
        (opener: Opener) => {
            opener.open({
                widget: 'Controls-Lists-editors-demo/ColumnEditor/DemoWidget',
                widgetProps: {},
                columns: result.columns,
                header: result.header,
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
                onChange: (value: IColumnsEditorValue) => {
                    setResult(value);
                },
            });
        },
        [result, bindings]
    );
    const editorDialog = React.useMemo(() => {
        return new Opener();
    }, []);
    React.useEffect(() => {
        openEditor(editorDialog);
    }, []);
    return (
        <div
            className={'tw-flex tw-self-end  tw-h-full ControlsListsEditorDemo_base-wrapper'}
            ref={ref}
        >
            <Container className={'ControlsListsEditorsDemo_control-wrapper'}>
                <View
                    storeId={'gridControlSlice'}
                    columns={result.columns}
                    header={result.header}
                    columnScroll={true}
                    width={1000}
                />
            </Container>
            <div className={'tw-justify-center tw-flex ControlsListsEditorsDemo-settings-wrapper'}>
                <Button
                    icon={'icon-Settings'}
                    onClick={() => {
                        openEditor(editorDialog);
                    }}
                    tooltip={'Настроить колонки'}
                    viewMode={'ghost'}
                />
            </div>
        </div>
    );
});

Base.getLoadConfig = (): Record<string, IDataConfig<IListDataFactoryArguments>> => {
    return {
        gridControlSlice: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    keyProperty: 'key',
                    data: newGetData(),
                }),
                displayProperty: 'title',
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
            },
        },
    };
};

export default Base;
