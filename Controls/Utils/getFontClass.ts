/**
 * Новые классы для работы со шрифтами по проекту
 * https://project.sbis.ru/uuid/30f35c68-044b-4bc7-b1e9-c8fb745a5409/page/project-main
 */

const HEADING_FONT_SIZE_MAP: Record<string, string> = {
    m: 'h6',
    xl: 'h5',
    '3xl': 'h4',
    '4xl': 'h3',
    '6xl': 'h2',
};

const TEXT_FONT_SIZE_MAP: Record<string, string> = {
    default: 'default',
    m: 'default',
    xs: 'xs',
    xl: 'xl',
    '3xl': '3xl',
};

/**
 * Возвращает класс для заголовка
 * @param fontSize
 */
function getHeaderFontSizeClass(fontSize?: string): string {
    if (fontSize) {
        const size = HEADING_FONT_SIZE_MAP[fontSize];
        if (size) {
            return `controls_heading-style_${size}`;
        }
    }
    return '';
}

/**
 * Возвращает класс для текста
 * @param fontSize
 */
function getTextFontSizeClass(fontSize?: string): string {
    if (fontSize) {
        const size = TEXT_FONT_SIZE_MAP[fontSize];
        if (size) {
            return `controls_text-style_${size}`;
        }
    }
    return '';
}

export { getHeaderFontSizeClass, getTextFontSizeClass };
