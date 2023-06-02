import { Fragment, memo, useMemo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { Control as ChipsControl, IChipsOptions } from 'Controls/Chips';
import { SelectedKey } from 'Controls/source';

interface IChipsEditorProps extends IPropertyEditorProps<string>, IChipsOptions {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: string;
}

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
                customEvents={['onSelectedKeyChanged']}>
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
