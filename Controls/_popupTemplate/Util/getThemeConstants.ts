/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { constants } from 'Env/Env';
import { Controller as ManagerController } from 'Controls/popup';

const themeConstantsGetter = (className, hashMap) => {
    if (!constants.isBrowserPlatform) {
        return {};
    }

    const obj = {};

    const div = document.createElement('div');
    div.setAttribute('class', className);
    div.setAttribute(
        'style',
        'position: absolute; top: -1000px; left: -1000px;'
    );
    document.body.appendChild(div);

    const computedStyles = getComputedStyle(div);
    for (const key in hashMap) {
        if (hashMap.hasOwnProperty(key)) {
            obj[key] = parseInt(computedStyles[hashMap[key]], 10);
        }
    }

    div.parentNode.removeChild(div);
    return obj;
};

function getConstants(
    themeName: string,
    className: string,
    hashMap: object
): object {
    return themeConstantsGetter(className, hashMap);
}

export default function initConstants(
    className: string,
    hashMap: object
): Promise<void | object> {
    let constantsInit;
    if (!constantsInit) {
        constantsInit = new Promise<object>((resolve, reject) => {
            if (!constants.isBrowserPlatform) {
                return resolve({});
            }
            import('Controls/popupTemplate')
                .then(({ InfoBox }) => {
                    return InfoBox.loadCSS();
                })
                .then(() => {
                    resolve(
                        getConstants(
                            ManagerController.getTheme(),
                            className,
                            hashMap
                        )
                    );
                });
        });
    }
    return constantsInit;
}
