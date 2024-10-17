import * as React from 'react';
import type { IItemTemplateProps } from 'Controls/list';

/**
 * Шаблон отображения ячейки
 * @param {IItemTemplateProps} props Пропсы компонента
 * @category component
 */
export default function Column(props: IItemTemplateProps) {
    const { item } = props;
    const title = item.contents.get('title');
    const customTitle = item.contents.get('customTitle');
    return (
        <div>
            {customTitle ? (
                <div>
                    <span>{title}</span>
                    <span
                        className={'ControlsListsEditors_columnsListPopup-column_customTitle'}
                    >{` (${customTitle})`}</span>
                </div>
            ) : (
                <div>{title}</div>
            )}
        </div>
    );
}
