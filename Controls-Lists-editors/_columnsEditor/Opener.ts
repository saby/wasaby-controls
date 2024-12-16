import { StackOpener } from 'Controls/popup';
import { getContextDataConfig } from './utils/data';
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
        this._contextConfig = {
            SiteEditorSlice: {
                dataFactoryName: 'FrameEditor/slice:SiteEditorSliceFactory',
                dataFactoryArguments: {
                    ...getContextDataConfig({
                        ...props,
                        allColumns: allOptions.columns,
                        allHeader: allOptions.header,
                    }),
                },
            },
            ...bindings.contextConfig,
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
