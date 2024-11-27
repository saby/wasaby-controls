const getPopupComponent = (popupComponentName: string) => {
    const popupComponentNameArray = popupComponentName.split(':');
    const libName = popupComponentNameArray[0];
    const componentName = popupComponentNameArray[1];
    return requirejs(libName)[componentName];
};

export default getPopupComponent;
