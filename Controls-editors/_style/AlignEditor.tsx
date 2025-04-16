import { memo, useMemo, Fragment, useCallback } from 'react';
import { TumblerEditor } from 'Controls-editors/toggle';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Button as DropdownButton } from 'Controls/dropdown';
import { EnumMeta, Meta } from 'Meta/types';

interface IAlignEditorProps extends IPropertyGridPropertyEditorProps<string> {
    dropdown?: boolean;
    dataQa?: string;
    alignMeta: EnumMeta<object>;
}

function getInheritId(meta: Meta<unknown>): string {
    const inherits = meta.getInherits() as string[];
    return inherits[inherits.length - 1];
}

/**
 * Реакт компонент, редактор для настройки выравнивания текста
 */
export const AlignEditor = memo((props: IAlignEditorProps) => {
    const { onChange, dropdown, LayoutComponent = Fragment, dataQa, alignMeta } = props;
    const alignsMeta = alignMeta.getElements();
    const value = props.value ?? getInheritId(alignsMeta[0]);
    const selectedMeta = useMemo(() => {
        return alignMeta
            .getElements()
            .find((meta) => getInheritId(meta) === value) as Meta<unknown>;
    }, [alignMeta, value]);

    const selectedKeys = useMemo(() => [value], [value]);
    const selectedIcon = selectedMeta.getIcon();

    const items = useMemo(() => {
        const rawData = alignsMeta.map((meta) => {
            return {
                id: getInheritId(meta),
                icon: meta.getIcon(),
                tooltip: meta.getTitle(),
            };
        });
        return new RecordSet({
            keyProperty: 'id',
            rawData,
        });
    }, [alignsMeta]);

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
                    items={items}
                    icon={selectedIcon}
                    selectedKeys={selectedKeys}
                    buttonStyle="unaccented"
                    viewMode="ghost"
                    data-qa={dataQa}
                    tooltip={alignMeta.getTitle()}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    closeButtonVisibility={false}
                    showHeader={false}
                    onMenuItemActivate={onDropdownChange}
                />
            </LayoutComponent>
        );
    }

    return <TumblerEditor options={items} {...props} value={value} />;
});
