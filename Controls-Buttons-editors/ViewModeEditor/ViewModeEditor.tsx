import { memo, Fragment, ReactElement, useState } from 'react';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Button } from 'Controls/buttons';
import { Title, Back } from 'Controls/heading';
import 'css!Controls-Buttons-editors/ViewModeEditor/ViewModeEditor';

interface IViewMode {
    caption: string;
    key: string;
}

export interface IOptions {
    control: ReactElement;
    controlOptions: object;
    viewModes: IViewMode[];
}

interface IStyleEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: string;
    options?: IOptions;
}

/**
 * Реакт компонент, редактор режима отображения
 * @class Controls-editors/_properties/ViewModeEditor
 * @public
 */
export const ViewModeEditor = memo((props: IStyleEditorProps) => {
    const { value, options, onChange, LayoutComponent = Fragment } = props;
    const [isSelected, setIsSelected] = useState<boolean>(false);
    let selectedValue = '';
    options.viewModes.forEach((viewMode) => {
        if (viewMode.key === value) {
            selectedValue = viewMode.caption;
        }
    });

    return (
        <LayoutComponent>
            {isSelected ? (
                <div
                    className="controls-viewModeEditor"
                    data-qa="controls-PropertyGrid__editor_view-mode-list"
                >
                    <Back
                        iconStyle="primary"
                        iconViewMode="functionalButton"
                        onClick={() => {
                            setIsSelected(false);
                        }}
                    />
                    {options.viewModes.map((viewModel) => {
                        return (
                            <div className="controls-viewModeEditor_item">
                                <div className="controls-padding_left-2xs">
                                    <Title caption={viewModel.caption} />
                                </div>
                                <div
                                    className="controls-viewModeEditor_item_content"
                                    onClick={() => {
                                        onChange(viewModel.key);
                                        setIsSelected(false);
                                    }}
                                >
                                    <options.control
                                        viewMode={viewModel.key}
                                        inlineHeight="xl"
                                        {...(options.controlOptions || {})}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Button
                    data-qa="controls-PropertyGrid__editor_view-mode-btn"
                    caption={selectedValue}
                    viewMode="link"
                    inlineHeight="m"
                    onClick={() => {
                        setIsSelected(!isSelected);
                    }}
                />
            )}
        </LayoutComponent>
    );
});
