import { Fragment, memo, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { EnumEditor } from 'Controls-editors/dropdown';
import { PreviewerTarget } from 'Controls/popupTargets';
import { Button } from 'Controls/buttons';
import IIconEditorPopup from './IIconEditorPopup';
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

const variants = [
    {
        caption: rk('Слева'),
        value: 'end',
    },
    {
        caption: rk('Справа'),
        value: 'start',
    },
];

/**
 * Реакт компонент, редактор иконки
 * @class Controls-editors/_properties/IconEditor
 * @public
 */
export const IconEditor = memo((props: IIconEditorProps) => {
    const { onChange, LayoutComponent = Fragment } = props;

    const previewerTarget = useRef<PreviewerTarget>();
    const propsRef = useRef(props);
    propsRef.current = props;

    const onChangeHandler = (iconPosition: TCaptionPosition) => {
        const res: IIconEditorValue = { ...propsRef.current.value };
        res.captionPosition = iconPosition;
        onChange(res);
    };

    const chooseHandler = (icon) => {
        const res: IIconEditorValue = { ...propsRef.current.value };
        if (icon.name !== 'empty') {
            res.uri = icon.name;
        } else {
            res.uri = '';
        }
        onChange(res);
        previewerTarget.current?.close();
    };

    const getIcon = () => {
        return propsRef.current.value.uri || 'icon-Close';
    };

    const getIconStyle = () => {
        return propsRef.current.value.uri ? 'secondary' : 'unaccented';
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
                <PreviewerTarget
                    ref={previewerTarget}
                    delay={200}
                    trigger="click"
                    actionOnScroll="none"
                    targetPoint={{ vertical: 'top', horizontal: 'left' }}
                    direction={{ vertical: 'top', horizontal: 'right' }}
                    content={(contentTemplate) => {
                        return (
                            <Button
                                ref={contentTemplate.$wasabyRef}
                                {...contentTemplate}
                                className="iconEditor_icon-button"
                                viewMode="link"
                                icon={getIcon()}
                                iconSize="m"
                                iconStyle={getIconStyle()}
                            />
                        );
                    }}
                    template={() => {
                        return <IIconEditorPopup onSendResult={chooseHandler} />;
                    }}
                />
                {getIcon() !== 'icon-Close' && (
                    <EnumEditor
                        type={props.type}
                        value={getCaptionPosition()}
                        options={variants}
                        onChange={onChangeHandler}
                    />
                )}
            </div>
        </LayoutComponent>
    );
});
