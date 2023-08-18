import { Fragment, memo, useCallback } from 'react';
import { Control as ChipsControl, IChipsOptions } from 'Controls/Chips';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { SelectedKey } from 'Controls/source';

interface IChipsEditorProps extends IPropertyGridPropertyEditorProps<string>, IChipsOptions {}

/**
 * Редактор для перечисляемого типа данных. В основе редактора используется контрол {@link Controls/Chips:Control}.
 * @public
 */
export const ChipsEditor = memo((props: IChipsEditorProps) => {
    const {
        items,
        value,
        onChange,
        direction,
        itemTemplate,
        viewMode,
        selectedStyle,
        contrastBackground,
        LayoutComponent = Fragment,
        fontSize,
        inlineHeight,
        allowEmptySelection,
        multiline,
    } = props;

    const onSelectedKeyChanged = useCallback((selectedKey) => {
        onChange(selectedKey);
    }, []);

    return (
        <LayoutComponent>
            <SelectedKey
                selectedKey={value}
                onSelectedKeyChanged={onSelectedKeyChanged}
                customEvents={['onSelectedKeyChanged']}
            >
                <ChipsControl
                    data-qa="controls-PropertyGrid__editor_chips"
                    attrs={{
                        style: { width: '100%' },
                    }}
                    selectedStyle={selectedStyle}
                    direction={direction}
                    itemTemplate={itemTemplate}
                    viewMode={viewMode}
                    contrastBackground={contrastBackground}
                    fontSize={fontSize}
                    inlineHeight={inlineHeight}
                    items={items}
                    allowEmptySelection={allowEmptySelection}
                    multiline={multiline}
                />
            </SelectedKey>
        </LayoutComponent>
    );
});
