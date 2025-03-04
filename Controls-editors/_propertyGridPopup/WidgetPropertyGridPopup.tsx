import { createContext, ForwardedRef, forwardRef } from 'react';
import { IPropertyGridPopup } from './IPropertyGridPopup';
import { default as PropertyGridPopup } from './PropertyGridPopup';

interface IWidgetPropertyGridPopup<RuntimeInterface extends object>
    extends IPropertyGridPopup<RuntimeInterface> {
    /**
     * Классы текущей цветовой и шрифтовой темы сайта
     */
    themeClasses: string;
}

export const WidgetThemeClassesContext = createContext<string>('');

/**
 * Реакт компонент, для отображения редактора виджета в диалоговом окне
 * @public
 **/
export const WidgetPropertyGridPopup = forwardRef(
    <RuntimeInterface extends object>(
        props: IWidgetPropertyGridPopup<RuntimeInterface>,
        ref: ForwardedRef<unknown>
    ) => {
        const { themeClasses, ...pgProps } = props;
        return (
            <WidgetThemeClassesContext.Provider value={themeClasses}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore проблемы с типами в PropertyGridPopup */}
                <PropertyGridPopup ref={ref} {...pgProps} />
            </WidgetThemeClassesContext.Provider>
        );
    }
);
