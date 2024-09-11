/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';

import { Highlight } from 'Controls/baseDecorator';
import { CharacteristicsTemplate } from 'Controls/list';

import Gradient from 'Controls/_tile/render/itemComponents/Gradient';
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import { ItemActionsControl } from 'Controls/_tile/render/itemComponents/ItemActions';

function Title(props: ITileItemProps): JSX.Element {
    if (!props.item.shouldDisplayTitle(props.itemType)) {
        return null;
    }

    const beforeTitleTemplate = props.beforeTitleTemplate && props.titleLines < 2 && (
        <div className={'controls-TileView__beforeTitleTemplate'}>
            {createElement(props.beforeTitleTemplate)}
        </div>
    );

    const afterTitleTemplate = props.afterTitleTemplate && (
        <div
            className={'controls-TileView__afterTitleTemplate-wrapper'}
            style={props.item.getBlurStyles(props)}
        >
            {createElement(props.afterTitleTemplate)}
        </div>
    );

    const bottomRightTemplate =
        props.bottomRightTemplate &&
        createElement(
            props.bottomRightTemplate,
            { ...props },
            { class: 'controls-TileView__previewTemplate_bottomRightTemplate' }
        );

    let titleContent;
    if (props.item.getSearchValue()) {
        titleContent = (
            <Highlight
                highlightedValue={props.item.getSearchValue()}
                value={String(props.item.getDisplayValue())}
                highlightClassName={props.highlightClassName}
            />
        );
    } else if (props.titleEditor && props.isEditing) {
        titleContent = createElement(props.titleEditor, { ...props });
    } else {
        titleContent = props.item.getDisplayValue();
    }

    return (
        <div className={props.item.getTitleClasses(props)} title={props.item.getDisplayValue()}>
            {beforeTitleTemplate}
            <div
                itemProp={'name'}
                className={props.item.getEllipsisClasses(props)}
                style={props.item.getTitleStyles(props)}
                data-qa={'controls-ItemTemplate__title'}
            >
                {titleContent}
            </div>
            {afterTitleTemplate}
            {bottomRightTemplate}
        </div>
    );
}

function Description(props: ITileItemProps): JSX.Element {
    if (props.isEditing && props.descriptionEditor) {
        return createElement(props.descriptionEditor);
    }

    if (props.item.shouldDisplayDescription(props)) {
        return (
            <div
                className={props.item.getDescriptionClasses(props)}
                style={props.item.getDescriptionStyles(props)}
                itemProp={props.description}
                title={props.description}
            >
                {props.description}
            </div>
        );
    }

    return null;
}

function Footer(props: ITileItemProps): JSX.Element {
    if (props.isEditing && props.footerEditor) {
        return createElement(
            props.footerEditor,
            { item: props.item, itemData: props.item },
            { class: props.item.getFooterClasses(props) }
        );
    }

    if (props.footerTemplate && props.itemType === 'rich') {
        return createElement(
            props.footerTemplate,
            { item: props.item, itemData: props.item },
            { class: props.item.getFooterClasses(props) }
        );
    }

    return null;
}

export default function TitleWrapper(
    props: ITileItemProps & { attrStyle?: React.CSSProperties }
): JSX.Element {
    const characteristics =
        props.characteristics && props.characteristics.length ? (
            <CharacteristicsTemplate
                items={props.characteristics}
                className={'controls-TileView__richTemplate_characteristics_spacing'}
            />
        ) : null;

    const wrapperStyleObject = {
        ...props.item.getTitleWrapperStyles(props),
        ...props.attrStyle,
    };
    return (
        <div className={props.item.getTitleWrapperClasses(props)} style={wrapperStyleObject}>
            <Gradient {...props} position={'title'} />
            <Title {...props} />
            {characteristics}
            <Description {...props} />
            <ItemActionsControl
                {...props}
                captionStyle={props.captionStyle}
                _hoveredItem={null}
                styleProp={null}
                topTemplate={null}
                footerTemplate={null}
                attrs={null}
                multiSelectTemplate={null}
                $wasabyRef={null}
            />
            <Footer {...props} />
        </div>
    );
}
