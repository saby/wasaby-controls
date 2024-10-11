import * as React from 'react';
import type { IItemTemplateProps } from 'Controls/list';

/**
 * Шаблон отображения ячейки
 * @param {IItemTemplateProps} props Пропсы компонента
 * @category component
 */
export default function Column(props: IItemTemplateProps) {
    const { item } = props;
    const title = React.useMemo(() => {
        return item.contents.get('title');
    }, [item]);
    const customTitle = React.useMemo(() => {
        return item.contents.get('customTitle');
    }, [title]);
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
