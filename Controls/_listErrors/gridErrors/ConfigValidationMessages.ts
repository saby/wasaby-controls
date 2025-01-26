const INVALID_COLUMN_WIDTH =
    'Error in Controls/grid:View: invalid column width value.\n' +
    'Please set valid value following the instructions https://wi.sbis.ru/docs/js/Controls/grid/IColumn/options/width\n\n' +
    "columns = [\n\t{\n\t\twidth: '${width}',\n\t\t...\n\t},\n\t...\n]\n";
const COLUMNS_ARE_REQUIRED =
    'Grid columns is undefined or empty! Please set columns for correct control behaviour.\n' +
    'Dont set empty columns to hide grid!';
const FIRST_COLUMN_INDEX_IS_NOT_ONE =
    'Invalid columns indexes configuration!\nFirst column index is not equal to "1". ' +
    "Please set it to one or undefined.\ncolumns = [\n\t{\n\t\tstartColumn: '${startColumn}',\n\t\t...\n\t},\n\t...\n]\n";
const END_OF_COLUMN_IS_NOT_A_START_OF_NEXT =
    'Invalid columns indexes configuration! ' +
    'End column index in columns is not equal to start column index of next.\n' +
    'Columns should set in column indexes order, for ex. \n[\n\t{startColumns: 1, endColumns: 3},\n\t{startColumns: 3, endColumns: 4}\n]\n';
const LAST_COLUMN_END_INDEX_IS_NOT_COLUMNS_END =
    'Invalid columns indexes configuration!\nEnd column index of last column is not ' +
    'equal to end column index of last column in grid.\n\n' +
    'End column index of last column in grid: ${gridColumnsEnd};\n' +
    'End column index of last column in option: ${columnsEnd};';
const COLUMN_INDEX_OUT_OF_GRID_COLUMNS_RANGE =
    'Invalid columns indexes configuration!\n' +
    'End column index of column is out of grid columns range.\n\n' +
    'End column index of last column in grid: ${gridColumnsEnd};\n' +
    'End column index of last column in option: ${columnsEnd};';
const START_INDEX_REQUIRE_END_INDEX =
    'Invalid header columns configuration! Indexes configuration can work correctly only in pair.\n' +
    'If start index setted, end index is required and vice-versa.';
const NOT_ALL_COLUMN_INDEXES_SETTED =
    'Invalid header columns configuration! Column indexes setted not in all columns. ' +
    'Please set it for correct control behaviour.';
const NOT_ALL_ROW_INDEXES_SETTED =
    'Invalid header columns configuration! Row indexes setted not in all columns. ' +
    'Please set it for correct control behaviour.';
const ROW_INDEX_SETTED_BUT_COLUMNS_INDEXES_NOT =
    'Invalid header columns configuration! Row indexes setted, but column indexes setted not in all columns. ' +
    'Please set it for correct control behaviour.';
const HEADER_CELL_COLLISION =
    'Invalid header columns configuration! Please check columns indexes. \n' +
    'There are a few reasons of error:\n' +
    '1. Header columns length is not equal to grid column length.\n' +
    '2. Header cell indexes is not match to grid column config.\n' +
    'Indexes must be in range from 1 to ${gridColumnsLength}.\n' +
    'Maybe, first columns in any row starts not from 1 or last columns separated from right edge of grid or gap exists between any columns/rows.\n' +
    'Also column indexes may be out of grid columns range.\n' +
    '3. One of header cell overflows other header cell.';
const LEFT_STICKY_COLUMN_WIDTH_WRONG_MEASUREMENT_UNIT =
    'Invalid left sticky column width measurement unit! \n' +
    'Measurement unit of left sticky column width must be in pixels. \n' +
    'Column width: ${width}';

export {
    INVALID_COLUMN_WIDTH,
    COLUMNS_ARE_REQUIRED,
    FIRST_COLUMN_INDEX_IS_NOT_ONE,
    END_OF_COLUMN_IS_NOT_A_START_OF_NEXT,
    LAST_COLUMN_END_INDEX_IS_NOT_COLUMNS_END,
    COLUMN_INDEX_OUT_OF_GRID_COLUMNS_RANGE,
    START_INDEX_REQUIRE_END_INDEX,
    NOT_ALL_COLUMN_INDEXES_SETTED,
    NOT_ALL_ROW_INDEXES_SETTED,
    ROW_INDEX_SETTED_BUT_COLUMNS_INDEXES_NOT,
    HEADER_CELL_COLLISION,
    LEFT_STICKY_COLUMN_WIDTH_WRONG_MEASUREMENT_UNIT,
};
