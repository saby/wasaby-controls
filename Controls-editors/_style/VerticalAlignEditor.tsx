import { memo, useMemo, Fragment, useCallback } from 'react';
import { TumblerEditor } from 'Controls-editors/toggle';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';

interface IVerticalAlignEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
    dropdown?: boolean;
}

const DEFAULT_ALIGN = 'middle';

const ALIGN_ICONS: Record<string, string> = {
    top: 'icon-AlignmentTop',
    middle: 'icon-AlignmentMiddle',
    bottom: 'icon-AlignmentBottom',
};

const VERTICAL_ALIGN = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: 'top',
            icon: ALIGN_ICONS.top,
        },
        {
            id: 'middle',
            icon: ALIGN_ICONS.middle,
        },
        {
            id: 'bottom',
            icon: ALIGN_ICONS.bottom,
        },
    ],
});

/**
 * Реакт компонент, редактор для настройки выравнивания текста по вертикали
 * @class Controls-editors/_style/VerticalAlignEditor
 * @public
 */
export const VerticalAlignEditor = memo((props: IVerticalAlignEditorProps) => {
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
                    items={VERTICAL_ALIGN}
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

    return <TumblerEditor options={VERTICAL_ALIGN} {...props} value={value} />;
});
