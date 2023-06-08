/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
const VIEW_MODES = {
    SLIDING: 'sliding',
    FULLSCREEN: 'fullscreen',
};

const DESKTOP_MODES = {
    DIALOG: 'dialog',
    STACK: 'stack',
};
//
const getAdaptiveDesktopMode = (viewMode: string, defaultMode: string) => {
    switch (viewMode) {
        case VIEW_MODES.SLIDING:
            return DESKTOP_MODES.DIALOG;
        case VIEW_MODES.FULLSCREEN:
            return DESKTOP_MODES.STACK;
    }
    return defaultMode;
};

export default getAdaptiveDesktopMode;
