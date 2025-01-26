import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';
import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';

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
