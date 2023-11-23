/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
import { useMemo, ComponentType, forwardRef } from 'react';
import { ItemTemplate as GridItemTemplate, IGridItemProps } from 'Controls/grid';
import { Async } from 'UICore/Async';
import * as React from 'react';
import PropertyGridCollectionItem from 'Controls/_propertyGridEditor/display/PropertyGridEditorCollectionItem';
import { useJumpingLabel } from 'Controls/propertyGrid';

interface IItemProps extends IGridItemProps {
    afterEditorTemplate: ComponentType;
    beforeItemTemplate: ComponentType;
    levelPadding: boolean;
}

const BeforeColumnContentTemplate = forwardRef(
    (
        props: IItemProps & {
            wasabyContext: Record<string, unknown>;
            item: PropertyGridCollectionItem;
        },
        ref
    ) => {
        const {
            beforeItemTemplate: BeforeItemTemplate,
            column,
            item,
            levelPadding,
            wasabyContext,
        } = props;

        const editorsProps = item.getEditorOptions();
        const { jumpingLabel } = useJumpingLabel(editorsProps, item.getEditorTemplateName());
        const captionPosition =
            editorsProps.jumpingLabel && !jumpingLabel ? 'none' : item.getCaptionPosition();
        const levelIndentClassName =
            'tw-flex-shrink-0 controls-TreeGrid__row-levelPadding_size_default';
        const getCheckboxClasses = useMemo((): string => {
            return [
                levelIndentClassName,
                `controls-PropertyGridEditor__multiSelect_caption-${captionPosition}`,
            ].join(' ');
        }, [item]);

        const levelPaddings = [];
        if (levelPadding && item.getLevel() > 1) {
            const maxLevel = item.getLevel() - 1;
            for (let i = 0; i < maxLevel; i++) {
                levelPaddings.push(<div key={i} className={levelIndentClassName} />);
            }
        }

        const MultiSelectTemplate = useMemo(() => {
            const shouldDisplayCheckbox =
                item.getMultiSelectVisibility() && item.getMultiSelectVisibility() !== 'hidden';

            const MultiSelectTemplate = item.getMultiSelectTemplate();

            if (!shouldDisplayCheckbox) {
                return null;
            }

            if (typeof MultiSelectTemplate === 'string' || MultiSelectTemplate instanceof String) {
                return (
                    <Async
                        templateName={item.getMultiSelectTemplate()}
                        templateOptions={{
                            item,
                            itemPadding: {
                                top: 'null',
                                bottom: 'null',
                            },
                            context: wasabyContext,
                        }}
                    />
                );
            }
            return (
                <MultiSelectTemplate
                    item={item}
                    itemPadding={{
                        top: 'null',
                        bottom: 'null',
                    }}
                    context={wasabyContext}
                />
            );
        }, [item]);

        if (column.getColumnConfig().displayProperty !== 'caption') {
            return null;
        }

        if (BeforeItemTemplate) {
            levelPaddings.push(
                <div key="beforeItem" className={getCheckboxClasses} ref={ref}>
                    <BeforeItemTemplate
                        {...props}
                        multiSelectTemplate={MultiSelectTemplate}
                        context={wasabyContext}
                    />
                </div>
            );
        }
        return levelPaddings.length ? levelPaddings : null;
    }
);

function AfterColumnContentTemplate(
    props: IItemProps & {
        wasabyContext: Record<string, unknown>;
    }
) {
    const { item, column, afterEditorTemplate: AfterEditorTemplate, wasabyContext } = props;

    if (!AfterEditorTemplate) {
        return null;
    }

    if (
        item.getCaptionPosition() === 'left' &&
        column.getColumnConfig().displayProperty !== 'type' &&
        !item.isNode()
    ) {
        return null;
    }

    return (
        <AfterEditorTemplate
            {...props}
            className={'controls-PropertyGridEditor__afterEditor_margin'}
            context={wasabyContext}
        />
    );
}

function Item(props: IItemProps) {
    const itemProps = { ...props, item: props.itemCollection };
    return (
        <GridItemTemplate
            {...itemProps}
            beforeColumnContentTemplate={BeforeColumnContentTemplate}
            afterColumnContentTemplate={AfterColumnContentTemplate}
        />
    );
}

export default Item;
