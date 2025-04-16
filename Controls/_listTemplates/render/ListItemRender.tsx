import * as React from 'react';
import { IListItemTemplateOptions } from '../interface/IListItemTemplate';
import { ItemTemplate } from 'Controls/baseList';
import type { CollectionItem } from 'Controls/display';
import ImageRender from './ImageRender';
import { CharacteristicsRender, ICharacteristic } from 'Controls/list';
interface ListItemRenderProps extends IListItemTemplateOptions {
    src: string;
    fallbackImage: string;
    viewMode: string;
    effect: string;
    item: CollectionItem;
    afterImageTemplate: React.FunctionComponent<{ item }>;
    characteristics?: ICharacteristic[];
    className?: string;
}

const ListItemRender = React.memo(function (props: ListItemRenderProps): React.ReactElement {
    const isEditing = props.item.isEditing();
    const imagePosition = props.imageViewMode === 'none' ? 'none' : props.imagePosition;
    return (
        <ItemTemplate
            itemVersion={0}
            keyPrefix={''}
            itemActionsTemplate={undefined}
            subPixelArtifactFix={false}
            pixelRatioBugFix={false}
            fixedPositionInitial={''}
            style={''}
            theme={''}
            readOnly={false}
            horizontalPadding={undefined}
            {...props}
            className={
                props.className +
                ' controls-listTemplates__listItemTemplate' +
                ` controls-listTemplates__listItemTemplate-checkboxPadding-${
                    props.imageViewMode === 'none' ? 'none' : props.imagePosition || 'left'
                }`
            }
        >
            <div
                className={`ws-flexbox controls-listTemplates__listItemTemplate-image_position-${
                    props.imagePosition || 'left'
                }`}
            >
                {imagePosition !== 'none' && props.imageViewMode !== 'none' && (
                    <ImageRender
                        className={`controls-listTemplates__listItemTemplate-image controls-listTemplates__listItemTemplate-image-padding_position-${
                            props.imagePosition || 'left'
                        }`}
                        effect={props.imageEffect}
                        afterImageTemplate={props.afterImageTemplate}
                        imageFit={props.imageFit}
                        fallbackImage={props.fallbackImage}
                        viewMode={props.imageViewMode}
                        src={props.item.contents.get(props.imageProperty)}
                        item={props.item}
                    />
                )}
                <div className="controls-listTemplates__listItemTemplate__itemContent">
                    {isEditing && props.captionEditor ? (
                        <props.captionEditor
                            template={props.captionEditor}
                            itemData={props.item}
                            item={props.item}
                        />
                    ) : (
                        props.captionTemplate && (
                            <props.captionTemplate
                                template={props.captionTemplate}
                                itemData={props.item}
                                item={props.item}
                            />
                        )
                    )}
                    {props.characteristics && props.characteristics.length && (
                        <CharacteristicsRender items={props.characteristics} />
                    )}
                    {isEditing && props.contentEditor ? (
                        <props.contentEditor itemData={props.item} item={props.item} />
                    ) : (
                        props.contentTemplate && (
                            <props.contentTemplate itemData={props.item} item={props.item} />
                        )
                    )}
                    {isEditing && props.footerEditor ? (
                        <props.footerEditor itemData={props.item} item={props.item} />
                    ) : (
                        props.footerTemplate && (
                            <div className="controls-listTemplates_listItemTemplate__footer">
                                <props.footerTemplate itemData={props.item} item={props.item} />
                            </div>
                        )
                    )}
                </div>
            </div>
        </ItemTemplate>
    );
});

export default ListItemRender;
