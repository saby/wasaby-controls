import { Fragment, memo, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { EnumEditor } from './EnumEditor';
import { PreviewerTarget } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import IIconEditorPopup from '../_objectEditorPopup/IIconEditorPopup';
import * as rk from 'i18n!Controls';

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

    return (
        <LayoutComponent>
            <div style={{ display: 'flex', gap: '10px' }}>
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
                        return (
                            <IIconEditorPopup onSendResult={chooseHandler} />
                        );
                    }}
                />

                <EnumEditor
                    type={props.type}
                    value={propsRef.current.value.captionPosition}
                    options={variants}
                    onChange={onChangeHandler}
                />
            </div>
        </LayoutComponent>
    );
});
