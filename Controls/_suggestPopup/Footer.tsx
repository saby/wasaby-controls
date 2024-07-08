import * as React from 'react';
import { Button } from 'Controls/buttons';
import * as rk from 'i18n!Controls';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export default React.forwardRef(function Footer(props, ref): JSX.Element {
    const { footerTemplate, showAllClickCallback, moreClickCallback, moreCount, isDefaultFooter } =
        props;
    const showAllClickCallbackHandler = React.useCallback(() => {
        showAllClickCallback();
    }, [showAllClickCallback]);

    const moreClickCallbackHandler = React.useCallback(() => {
        moreClickCallback();
    }, [moreClickCallback]);

    if (!footerTemplate.templateName) {
        return null;
    }

    if (!isDefaultFooter) {
        const ContentTpl = loadSync(footerTemplate.templateName);
        return (
            <ContentTpl
                {...footerTemplate.templateOptions}
                showSelectorButtonTemplate={
                    <ShowSelectorButtonTemplate
                        footerTemplate={footerTemplate}
                        showAllClickCallback={showAllClickCallbackHandler}
                    />
                }
                showMoreButtonTemplate={<ShowMoreButtonTemplate {...props} />}
            />
        );
    }

    return (
        <DefaultFooterTemplate
            footerTemplate={footerTemplate}
            moreCount={moreCount}
            showAllClickCallback={showAllClickCallbackHandler}
            moreClickCallback={moreClickCallbackHandler}
        />
    );
});

function ShowSelectorButtonTemplate(props): JSX.Element {
    const { footerTemplate, showAllClickCallback } = props;
    if (footerTemplate.templateOptions?.showSelectorButtonTemplate) {
        return (
            <span className="controls-Suggest__showAllLink">
                <span className="controls-Suggest__showAllLink-content">
                    <footerTemplate.templateOptions.showSelectorButtonTemplate />
                </span>
            </span>
        );
    } else if (footerTemplate.templateOptions?.showSelectorButtonTemplate !== null) {
        return (
            <Button
                className="controls-Suggest__showAllLink"
                viewMode="link"
                data-qa="controls-Suggest__showMore"
                caption={
                    footerTemplate.templateOptions?.caption
                        ? footerTemplate.templateOptions.caption
                        : rk('Показать все')
                }
                fontColorStyle="label"
                onClick={showAllClickCallback}
            />
        );
    } else {
        return null;
    }
}

function ShowMoreButtonTemplate(props): JSX.Element {
    const { moreCount, moreClickCallback } = props;
    return (
        <Button
            data-qa="controls-Suggest__showMore"
            caption={rk('Еще') + ' ' + moreCount}
            inlineHeight="s"
            fontSize="m"
            buttonStyle="pale"
            viewMode="link"
            fontColorStyle="label"
            className="controls-Suggest__showMoreButtonTemplate controls-Suggest__moreLink-content"
            onClick={moreClickCallback}
        />
    );
}

function DefaultFooterTemplate(props): JSX.Element {
    const { footerTemplate, showAllClickCallback, moreClickCallback, moreCount } = props;
    return (
        <>
            {props.moreCount ? (
                <ShowMoreButtonTemplate
                    moreClickCallback={moreClickCallback}
                    moreCount={moreCount}
                />
            ) : null}
            <ShowSelectorButtonTemplate
                showAllClickCallback={showAllClickCallback}
                footerTemplate={footerTemplate}
            />
        </>
    );
}
