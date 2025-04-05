import { StackOpener } from 'Controls/popup';
import { getContextDataConfig, validateColumnsConfig, validateHeaderConfig } from './utils/data';
import { IOpenColumnsEditorProps, IColumnsProps } from './interface';
import { IContextConfig } from './interface';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { getAllOptions } from './utils/data';

/**
 * Компонент - opener окна настройки колонок
 * @public
 */
export class Opener {
    protected _dialog: StackOpener;
    protected _contextConfig: IContextConfig;
    protected _contextData: object;

    async open(props: IOpenColumnsEditorProps) {
        if (!this._dialog) {
            this._dialog = new StackOpener();
        }

        const { objectName, bindings } = props.editorProps;
        const allOptions = await getAllOptions({ objectName });
        const columns = validateColumnsConfig(props.value.columns);
        const header = validateHeaderConfig(props.value.header);
        //TODO Конфигурация слайса прикладного виджета должна полностью перейти на уровень редактора колонок
        // прикладная опция bindings сейчас нужна, чтобы передавать значения ячеек для таблицы
        // после выполнения задачи https://online.sbis.ru/opendoc.html?guid=93e0ac3e-0f0b-4d3e-8e48-5207fed990cc&client=3
        // значения ячеек таблицы будем получать в редакторе по имени прикладного объекта
        this._contextConfig = {
            ...bindings.contextConfig,
            SiteEditorSlice: {
                dataFactoryName: 'FrameEditor/slice:SiteEditorSliceFactory',
                dataFactoryArguments: {
                    ...getContextDataConfig({
                        value: {
                            columns,
                            header,
                        },
                        onChange: props.onChange,
                        editorProps: props.editorProps,
                        allColumns: allOptions.columns,
                        allHeader: allOptions.header,
                    }),
                },
            },
            GridWidgetSlice: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    ...bindings.contextConfig.GridWidgetSlice.dataFactoryArguments,
                    columns,
                    header,
                },
            },
        };
        this._contextData = await Loader.load(this._contextConfig);

        return this._dialog.open({
            ...props,
            template: 'Controls-Lists-editors/columnsEditor:RenderWrapper',
            fullscreen: true,
            templateOptions: {
                contextConfig: this._contextConfig,
                contextData: { ...this._contextData, ...bindings.contextData },
                onClose: () => {
                    return this.close();
                },
            },
            eventHandlers: {
                onResult: (result: IColumnsProps) => {
                    props.onChange(result);
                },
            },
        });
    }
    close() {
        if (this._dialog.isOpened()) {
            this._dialog.close();
        }
    }

    destroy() {
        this?._dialog.destroy();
    }
}
