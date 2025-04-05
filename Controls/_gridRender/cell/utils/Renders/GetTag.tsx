/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { importer, lazy } from 'UI/Async';
import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';

const TagTemplateReact = lazy(() => importer('Controls/Application/TagTemplate/TagTemplateReact'));

/**
 * Приватный компонент тега-уголока в ячейке таблицы
 * @private
 */
export default function getTag(
    props: Pick<
        IDataCellComponentProps,
        'tagStyle' | 'tagPosition' | 'tagClassName' | 'topRightBorderRadius'
    >
) {
    return (
        <TagTemplateReact
            tagStyle={props.tagStyle}
            position={props.tagPosition === 'border' ? 'topRight' : 'custom'}
            className={
                'js-controls-tag ' +
                (props.tagPosition === 'content'
                    ? 'controls-Grid__cell_tag_position_content '
                    : '') +
                (props.tagClassName || '') +
                ` controls-ListView__item_roundBorder_topRight_${props.topRightBorderRadius} `
            }
        />
    );
}
