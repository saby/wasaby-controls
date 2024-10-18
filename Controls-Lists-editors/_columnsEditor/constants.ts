/**
 * Константы, используемые в "Редакторе колонок"
 */
export const DEFAULT_COLUMN_PARAMS = {
    width: 120,
    align: 'left',
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
};
export const START_ROW = 1;
export const END_ROW = 2;
export const FIRST_COLUMN = 1;
export const COLUMN_INDEX_OFFSET = {
    right: 1,
    left: 0,
};
export const ADD_ON_RIGHT_MODE = 'right';
export const ADD_ON_LEFT_MODE = 'left';
export const MIN_COLUMN_WIDTH = 30;
export const MAX_COLUMN_WIDTH = 9999;
export const MAX_COLUMN_AUTO = 'max-content';
export const DEFAULT_MIN_MAIN_COLUMN_WIDTH = 200;
export const DEFAULT_MAX_MAIN_COLUMN_WIDTH = '1fr';
export const AUTO_MODE = 'auto';
export const FIXED_MODE = 'fixed';
export const PERCENT_UNIT = '%';
export const PIXEL_UNIT = 'px';
export const HUNDRED_PERCENT = 100;
export const INIT_SCROLL_LEFT = 0;
export const FRAME_ID = 'mainFrame';
export const FIT_WIDTH = 60;
export const PRIMARY_COLUMN_DEFAULT_PARAMS = {
    width: 'minmax(200px, 1fr)',
    columnSeparatorSize: {},
};
export const SECONDARY_COLUMN_DEFAULT_PARAMS = {
    width: 'max-content',
    whiteSpace: 'normal',
    align: 'left',
    columnSeparatorSize: {},
};
export const FOLDER_DEFAULT_PARAMS = {
    caption: 'Название папки',
    align: 'center',
    whiteSpace: 'normal',
};

export const ACTION_DELETE = 'delete';
export const ACTION_ADD = 'add';
export const ACTION_MOVE = 'move';
export const MAIN_COLUMN_INDEX = 0;
export const ADD_BUTTON_WIDTH = 80;
export const FAKE_COLUMN = 'fake_column';
export const FAKE_HEADER = 'fake_header';

export const JS_GRID_SELECTOR = '.controls-GridReact__view_columnScroll_scrollable';
export const JS_GRID_HEADER_SELECTOR = '.controls-GridReact__header';
export const JS_GRID_COLUMN_SCROLL_THUMB_CLASSNAME = 'controls-VScrollbar__thumbWrapper';
export const JS_GRID_TEMPLATE_SELECTOR = '.controls-Grid';
