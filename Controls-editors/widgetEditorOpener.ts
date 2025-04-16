import { IObjectEditorOpenerProps, default as ObjectEditorOpener } from './objectEditorOpener';

export interface IWidgetEditorOpenerProps extends IObjectEditorOpenerProps {
    /**
     * Классы, которыми применяется тема к редактируемому фрейму
     */
    themeClasses: string;
    /**
     * Признак, указывающий в какой цветовой схеме (светлой/темной) находится виджет
     */
    isLightColorScheme: boolean;
}

/**
 * Опенер редактора типа "Виджет"
 * @public
 **/
export class WidgetEditorOpener extends ObjectEditorOpener {
    private _options: IWidgetEditorOpenerProps;
    open(options: IWidgetEditorOpenerProps): Promise<void> {
        this._options = options;
        return super.open(options);
    }

    protected override getTemplateProps() {
        return {
            themeClasses: this._options.themeClasses,
            isLightColorScheme: this._options.isLightColorScheme,
        };
    }

    protected override getDefaultTemplate(): Promise<string> {
        return Promise.resolve('Controls-editors/propertyGridPopup:WidgetPropertyGridPopup');
    }
}
