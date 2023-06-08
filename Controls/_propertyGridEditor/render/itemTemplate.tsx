/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import {
    ItemTemplate as GridItemTemplate,
    IGridItemProps,
} from 'Controls/grid';
import { TInternalProps } from 'UICore/Executor';

interface IItemProps extends IGridItemProps {
    afterEditorTemplate: React.Component | React.FunctionComponent;
    beforeItemTemplate: React.Component | React.FunctionComponent;
    levelPadding: boolean;
}

function isLastIteration(iteration: number, length: number): boolean {
    return iteration + 1 === length;
}

function BeforeEditorTemplate(
    props: IItemProps & {
        wasabyContext: Record<string, unknown>;
        multiSelectTemplate: React.Component;
    }
): React.ReactElement {
    return createElement(
        props.beforeItemTemplate,
        {
            ...props,
            multiSelectTemplate: React.forwardRef(
                (multiSelectProps: TInternalProps, _) => {
                    const shouldDisplayCheckbox =
                        props.item.getMultiSelectVisibility() &&
                        props.item.getMultiSelectVisibility() !== 'hidden';
                    return (
                        shouldDisplayCheckbox &&
                        createElement(
                            props.item.getMultiSelectTemplate() as React.Component,
                            {
                                item: props.item,
                                itemPadding: {
                                    top: 'null',
                                    bottom: 'null',
                                },
                                $wasabyRef: multiSelectProps.$wasabyRef,
                            } as object,
                            multiSelectProps.attrs as Attr.IAttributes
                        )
                    );
                }
            ),
        },
        props.attrs,
        undefined,
        props.context
    );
}

function BeforeColumnContentTemplate(props: IItemProps): React.ReactElement {
    if (props.column.getColumnConfig().displayProperty !== 'caption') {
        return null;
    }

    const levelIndentClassName =
        'tw-flex-shrink-0 controls-TreeGrid__row-levelPadding_size_default';
    const getCheckboxClasses = (item): string => {
        const marginClasses = ` controls-PropertyGridEditor__multiSelect_caption-${item.getCaptionPosition()} `;
        return `${levelIndentClassName} ${marginClasses}`;
    };

    const levelPaddings = [];
    if (props.levelPadding && props.item.getLevel() > 1) {
        const maxLevel = props.item.getLevel() - 1;
        for (let i = 0; i < maxLevel; i++) {
            levelPaddings.push(
                <div key={i} className={levelIndentClassName} />
            );
        }
    }
    if (props.beforeItemTemplate) {
        levelPaddings.push(
            <div className={getCheckboxClasses(props.item)}>
                {BeforeEditorTemplate(props)}
            </div>
        );
    }
    return levelPaddings.length ? levelPaddings : null;
}

function AfterColumnContentTemplate(
    props: IItemProps & {
        wasabyContext: Record<string, unknown>;
    }
): React.ReactElement {
    if (
        props.item.getCaptionPosition() === 'left' &&
        props.column.getColumnConfig().displayProperty !== 'type' &&
        !props.item.isNode()
    ) {
        return null;
    }
    if (!props.afterEditorTemplate) {
        return null;
    }
    return createElement(
        props.afterEditorTemplate,
        { ...props },
        { class: 'controls-PropertyGridEditor__afterEditor_margin' },
        undefined,
        props.wasabyContext
    ) as React.ReactElement;
}

function Item(props: IItemProps): React.ReactElement {
    const itemProps = { ...props, item: props.itemCollection };
    return (
        <GridItemTemplate
            {...itemProps}
            beforeColumnContentTemplate={BeforeColumnContentTemplate}
            afterColumnContentTemplate={AfterColumnContentTemplate}
        />
    );
}

export default React.memo(Item);
