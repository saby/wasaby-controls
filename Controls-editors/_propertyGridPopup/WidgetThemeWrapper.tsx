import { PropsWithChildren, useContext } from 'react';
import { WidgetThemeClassesContext } from './WidgetPropertyGridPopup';

interface IWidgetThemeWrapper {
    /**
     * Тип цветовой темы, если не указано будет применена текущая схема сайта
     */
    scheme?: 'light' | 'dark';
}

const DARK = 't-dark';
const LIGHT = 't-light';

export function useWidgetThemeClasses(scheme?: 'light' | 'dark') {
    let themeClasses = useContext(WidgetThemeClassesContext);
    if (scheme) {
        const allClasses = themeClasses
            .split(' ')
            .filter((name) => name && ![DARK, LIGHT].includes(name));
        switch (scheme) {
            case 'light':
                allClasses.push(LIGHT);
                break;
            case 'dark':
                allClasses.push(DARK);
                break;
        }
        themeClasses = allClasses.join(' ');
    }
    return themeClasses;
}

/**
 * Компонент применяет цветовую и шрифтовую тему сайта к своему содержимому.
 * @public
 */
export function WidgetThemeWrapper(props: PropsWithChildren<IWidgetThemeWrapper>) {
    const themeClasses = useWidgetThemeClasses(props.scheme);
    return <div className={`tw-contents ${themeClasses}`}>{props.children}</div>;
}
