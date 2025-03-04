import { memo, useMemo, Fragment, useCallback } from 'react';
import { TumblerEditor } from 'Controls-editors/toggle';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';

interface ITextAlignEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
    dropdown?: boolean;
}

const DEFAULT_ALIGN = 'left';

const ALIGN_ICONS: Record<string, string> = {
    left: 'icon-AlignmentLeft',
    center: 'icon-AlignmentCenter',
    right: 'icon-AlignmentRight',
    justify: 'icon-AlignmentWidth',
};

const TEXT_ALIGN = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: 'left',
            icon: ALIGN_ICONS.left,
        },
        {
            id: 'center',
            icon: ALIGN_ICONS.center,
        },
        {
            id: 'right',
            icon: ALIGN_ICONS.right,
        },
        {
            id: 'justify',
            icon: ALIGN_ICONS.justify,
        },
    ],
});

/**
 * Реакт компонент, редактор для настройки выравнивания текста
 * @class Controls-editors/_style/TextAlignEditor
 * @public
 */
export const TextAlignEditor = memo((props: ITextAlignEditorProps) => {
    const { onChange, dropdown, LayoutComponent = Fragment } = props;
    const value = props.value ?? DEFAULT_ALIGN;
    const selectedKeys = useMemo(() => [value], [value]);

    const onDropdownChange = useCallback(
        (item: Model) => {
            onChange?.(item.getKey());
        },
        [onChange]
    );

    if (dropdown) {
        return (
            <LayoutComponent>
                <DropdownButton
                    items={TEXT_ALIGN}
                    icon={ALIGN_ICONS[value]}
                    selectedKeys={selectedKeys}
                    buttonStyle="unaccented"
                    viewMode="ghost"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    closeButtonVisibility={false}
                    showHeader={false}
                    onMenuItemActivate={onDropdownChange}
                />
            </LayoutComponent>
        );
    }

    return <TumblerEditor options={TEXT_ALIGN} {...props} value={value} />;
});
