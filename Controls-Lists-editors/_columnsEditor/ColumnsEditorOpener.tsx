import { Component } from 'react';
import { DialogOpener } from 'Controls/popup';
import { getContextDataConfig } from './utils/data';
import { IOpenColumnsEditorProps } from './interface';
import { IContextConfig } from './interface';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { getAllOptions } from './utils/data';

/**
 * Компонент - opener окна настройки колонок
 */
export class ColumnsEditorOpener extends Component {
    protected _dialog: DialogOpener;
    protected _contextConfig: IContextConfig;
    protected _contextData: object;

    async open(props: IOpenColumnsEditorProps) {
        if (!this._dialog) {
            this._dialog = new DialogOpener();
        }

        const allOptions = await getAllOptions({ objectName: props.objectName });
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
            ...props.bindings.contextConfig,
        };
        this._contextData = await Loader.load(this._contextConfig);

        return this._dialog.open({
            ...props,
            template: 'Controls-Lists-editors/columnsEditor:ColumnsEditorPopupRender',
            templateOptions: {
                contextConfig: this._contextConfig,
                contextData: { ...this._contextData, ...props.bindings.contextData },
                onClose: () => {
                    return this.close();
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
