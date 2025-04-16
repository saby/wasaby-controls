import { Fragment, memo, useCallback, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { RecordSet } from 'Types/collection';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { Control as TumblerControl } from 'Controls/Tumbler';
import { PreviewerTarget } from 'Controls/popupTargets';
import { OnlyIconEditor } from './OnlyIconEditor';
import * as rk from 'i18n!Controls-editors';

type TCaptionPosition = 'start' | 'end';

interface IIconEditorValue {
    uri: string;
    icon: string;
    captionPosition: TCaptionPosition;
}

interface IIconEditorProps extends IPropertyEditorProps<IIconEditorValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IIconEditorValue;
    placeholder?: string;
}

const variants = new RecordSet({
    rawData: [
        {
            caption: rk('Слева'),
            id: 'end',
        },
        {
            caption: rk('Справа'),
            id: 'start',
        },
    ],
});

const DEFAULT_ICON = 'icon-Close';

/**
 * Реакт компонент, редактор иконки с выбором ее расположения
 * @class Controls-editors/_properties/IconEditor
 * @public
 */
export const IconEditor = memo((props: IIconEditorProps) => {
    const { onChange, LayoutComponent = Fragment } = props;

    const previewerTarget = useRef<PreviewerTarget>();
    const propsRef = useRef(props);
    propsRef.current = props;

    const onChangeHandler = useCallback(
        (iconPosition: TCaptionPosition) => {
            const res: IIconEditorValue = { ...propsRef.current.value };
            res.captionPosition = iconPosition;
            onChange(res);
        },
        [onChange]
    );

    const chooseHandler = useCallback(
        (icon) => {
            const res: IIconEditorValue = { ...propsRef.current.value, uri: icon };
            onChange(res);
            previewerTarget.current?.close();
        },
        [onChange]
    );

    const getIcon = () => {
        return propsRef.current.value.uri || DEFAULT_ICON;
    };

    const getCaptionPosition = () => {
        return propsRef.current.value.captionPosition || 'end';
    };

    return (
        <LayoutComponent>
            <div
                className="tw-flex tw-items-baseline"
                style={{ gap: '10px' }}
                data-qa="controls-PropertyGrid__editor_icon"
            >
                <OnlyIconEditor
                    className="iconEditor_icon-button"
                    value={getIcon()}
                    onChange={chooseHandler}
                />
                {getIcon() !== DEFAULT_ICON && (
                    <TumblerControl
                        selectedKey={getCaptionPosition()}
                        items={variants}
                        onSelectedKeyChanged={onChangeHandler}
                        inlineHeight="s"
                        data-qa={'Controls-editors_properties_IconEditor__captionPosition'}
                    />
                )}
            </div>
        </LayoutComponent>
    );
});
