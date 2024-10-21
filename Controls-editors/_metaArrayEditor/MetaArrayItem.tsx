import { useCallback } from 'react';
import { Button } from 'Controls/buttons';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { useEditorsLoader } from 'Controls-editors/objectEditorOpener';
import * as translate from 'i18n!Controls-editors';
import 'css!Controls-editors/_metaArrayEditor/MetaArrayItem';

interface IArrayItemProps {
    className?: string;
    item?: {
        id: string;
        value: unknown;
    };
    onDelete: Function;
    onChange: (value: object) => void;
    typesMap: object;
}

export default function MetaArrayItem(props: IArrayItemProps): JSX.Element {
    const { className, onDelete, onChange, item = {}, typesMap = {} } = props;
    const typePath = typesMap[item.id];
    const metaType = typePath && isLoaded(typePath) && loadSync(typePath);

    const onClick = useCallback(() => {
        onDelete(item);
    }, [item, onDelete]);

    const isMetaWithAttributes = useCallback(() => {
        const attributes = metaType?.getProperties?.();
        const visibleAttributesNames = Object.keys(attributes || {}).filter((attributeName) => {
            return !attributes[attributeName].isHidden();
        });
        return visibleAttributesNames?.length;
    }, [metaType]);

    const canShowEditors = isMetaWithAttributes() && useEditorsLoader(metaType);

    return (
        <div
            className={`controls-ArrayItem ${
                !isMetaWithAttributes() ? 'controls-ArrayItem_withBottomOffset' : ''
            } ${className}`}
        >
            <div className="controls-ArrayItem__header ws-flexbox ws-justify-content-between ws-align-items-baseline">
                <div className="controls-ArrayItem__title">{metaType?.getTitle()}</div>
                <Button
                    className="controls-margin_right-s"
                    viewMode="link"
                    icon="icon-Close"
                    tooltip={translate('Удалить')}
                    onClick={onClick}
                />
            </div>
            {canShowEditors ? (
                <PropertyGrid
                    metaType={metaType}
                    onChange={onChange}
                    value={item.value}
                    className="controls-ArrayItem__objectGridEditor"
                    captionColumnWidth="40%"
                />
            ) : null}
        </div>
    );
}
