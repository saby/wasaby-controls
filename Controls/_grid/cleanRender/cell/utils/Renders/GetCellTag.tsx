import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';
import { IDataCellComponentProps } from 'Controls/_grid/cleanRender/cell/interface/IDataCellComponent';

export default function getCellTag(
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
