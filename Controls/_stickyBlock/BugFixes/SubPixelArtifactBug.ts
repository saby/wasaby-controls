/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
/**
 * В StickyBlock может лежать контент, у которого по бокам рисуется border. В таком случае, border будут
 * перекрыты box-shadow. Вводим возможность отключить box-shadow через навешивание класса.
 * Этот способ отключения будет описан в статье отладке скролла и стикиблоков:
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/debug/scroll-container/ после
 * https://online.sbis.ru/opendoc.html?guid=9e7f5914-3b96-4799-9e1d-9390944b4ab3
 * @param backgroundStyle
 */
export function getSubPixelArtifactBugFixClass(
    backgroundStyle: string
): string {
    return `controls-StickyBlock__subpixelFix-${backgroundStyle}`;
}

export function updateSubPixelArtifactBugFixClass(
    instance: {
        _subPixelArtifactBugFixClass: string;
    },
    backgroundStyle: string,
    subPixelArtifactFix: boolean
): void {
    let newClass = '';

    if (subPixelArtifactFix) {
        newClass = getSubPixelArtifactBugFixClass(backgroundStyle);
    }

    if (instance._subPixelArtifactBugFixClass !== newClass) {
        instance._subPixelArtifactBugFixClass = newClass;
    }
}
