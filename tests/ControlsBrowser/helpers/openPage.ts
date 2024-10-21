/**
 * Открывает указанную страницу и дожидается её оживления.
 * @param url Адрес страницы, которую нужно открыть. Вместо %2F можно передавать настоящие слэши.
 * @author Зайцев А.С.
 */
export async function openPage(url: string): Promise<void> {
    await browser.url(url.replace(/\//g, '%2F'));
    return browser.executeAsync((done) => {
        function waitForHydration(): void {
            window.requirejs(['SbisEnvUI/Bootstrap'], (Bootstrap) => {
                Bootstrap.default.onAfterMountPromise().then(() => {
                    done();
                });
            });
        }

        if (window.requirejs) {
            waitForHydration();
        } else {
            const interval = window.setInterval(() => {
                if (window.requirejs) {
                    clearInterval(interval);
                    waitForHydration();
                }
            }, 200);
        }
    });
}
