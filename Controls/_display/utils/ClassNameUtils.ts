import { TBorderStyle, TBorderVisibility } from '../interface/ICollectionItem';

export interface IGetEditorViewClassNameParams {
    editingMode?: 'row' | 'cell';

    inputBackgroundVisibility?: 'visible' | 'onhover' | 'hidden';
    inputBorderVisibility?: 'partial' | 'hidden';
    fontSize?: 'default' | 's' | 'm' | 'l';

    withPadding?: boolean;
    cellInputBackgroundVisible?: boolean;
    active?: boolean;
}

export function getEditorViewRenderClassName(params: IGetEditorViewClassNameParams = {}): string {
    let classes = 'controls-EditingTemplateText';
    classes += ' controls-EditingTemplateText_border-partial';
    if (params.fontSize) {
        classes += ` controls-EditingTemplateText_size_${params.fontSize}`;
    }

    // Странно что нет выравнивания при редактировании по ячейкам
    if (params.withPadding || params.editingMode !== 'cell') {
        classes += ' controls-EditingTemplateText_withPadding';
    }

    const inputBackgroundVisibility = params.inputBackgroundVisibility;
    if (inputBackgroundVisibility === 'visible' || params.inputBorderVisibility === 'partial') {
        classes += ' controls-EditingTemplateText_borderBottom';
    }
    if (
        inputBackgroundVisibility !== 'hidden' &&
        (params.cellInputBackgroundVisible || params.cellInputBackgroundVisible === undefined)
    ) {
        classes += ` controls-EditingTemplateText_InputBackgroundVisibility_${inputBackgroundVisibility}`;
    }

    if (params.active) {
        classes += ' controls-EditingTemplateText_active';
    }

    return classes;
}

export function getEditorClassName(align: string, editingMode: 'row' | 'cell'): string {
    let classes =
        'controls-EditingTemplateText__editorWrapper js-controls-List__editingTemplate js-controls-Grid__editInPlace__input-';
    const resolvedAlign = align || (editingMode === 'cell' ? 'default' : 'left');
    classes += ` controls-EditingTemplateText__editorWrapper_align_${resolvedAlign}`;
    return classes;
}

export function getBorderClassName(
    borderVisibility: TBorderVisibility = 'hidden',
    borderStyle: TBorderStyle = 'default',
    addLeftBorder: boolean,
    addRightBorder: boolean
): string {
    if (borderVisibility === 'hidden') {
        return '';
    }

    let className = ` controls-ListView__itemContent_border_${borderVisibility}`;
    className += ` controls-ListView__itemContent_border_${borderStyle}`;
    if (addLeftBorder) {
        className += ` controls-ListView__itemContent_border_left_${borderVisibility}`;
    }
    if (addRightBorder) {
        className += ` controls-ListView__itemContent_border_right_${borderVisibility}`;
    }
    return className;
}
