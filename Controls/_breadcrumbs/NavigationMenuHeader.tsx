interface INavigationMenuHeaderProps {
    caption?: string;
    readOnly?: boolean;
    goToRootCallback: Function;
}
export function NavigationMenuHeader(props: INavigationMenuHeaderProps) {
    const { goToRootCallback, caption = 'На главную', readOnly = false } = props;
    return (
        <div className={'controls-breadcrumbsPathButton__menu_header-wrapper'}>
            <div
                className={'controls-breadcrumbsPathButton__menu-header'}
                data-qa={'controls-breadcrumbsMenuButton__menuHeader'}
            >
                <div
                    className={`controls-breadcrumbsPathButton__home-button
                            ${
                                readOnly
                                    ? 'controls-breadcrumbsPathButton__home-button_readonly'
                                    : ''
                            }`}
                    data-qa={'controls-breadcrumbsMenuButton__menuHeaderHome'}
                    onClick={goToRootCallback}
                >
                    <div
                        className={`controls-breadcrumbsPathButton__home-button__caption ${
                            readOnly ? 'tw-cursor-text' : ''
                        }`}
                    >
                        {caption}
                    </div>
                </div>
            </div>
        </div>
    );
}
