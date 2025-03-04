import * as React from 'react';
import type { IItemTemplateProps } from 'Controls/list';
import * as rk from 'i18n!Controls-Lists-editors';
import { template } from 'Types/formatter';

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
                    <span>{template(rk(title), { title })}</span>
                    <span className={'ControlsListsEditors_columnsListPopup-column_customTitle'}>
                        {template(rk(` (${customTitle})`), { customTitle })}
                    </span>
                </div>
            ) : (
                <div>{title}</div>
            )}
        </div>
    );
}
