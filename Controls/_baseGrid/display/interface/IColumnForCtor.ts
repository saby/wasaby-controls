interface IColumn {
    displayProperty: string;
    width: string; // редактор выдает сложную строку в формате css grid https://wi.sbis.ru/docs/js/Controls/grid/IColumn/options/width/?v=23.6200
    textOverflow: 'ellipsis' | 'none';
    align: 'left' | 'center' | 'right';
    columnSeparatorSize: {
        left: string | null;
        right: string | null; // для обычной тонкой линии надо задать значение 's'
    };
}

export type TColumns = IColumn[];

interface IHeaderColumn {
    align: 'left' | 'center' | 'right';
    caption: string;
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
}

export type THeader = IHeaderColumn[];
