import { TInternalProps } from 'UICore/Executor';
import { INavigationButtonConfig } from 'Controls/interface';

interface IClickHandler {
    onClick?: () => void;
}

interface ISeparatorProps extends IClickHandler {
    buttonConfig: INavigationButtonConfig;
    value?: boolean;
}

interface IButtonProps extends IClickHandler {
    linkFontSize: string;
    linkFontColorStyle: string;
    loadMoreCaption: string;
    linkLabel?: string;
    linkClass?: string;
}

export interface INavigationButtonProps extends ISeparatorProps, IButtonProps, TInternalProps {
    buttonView: 'separator' | 'link';
    readOnly: boolean;
}
