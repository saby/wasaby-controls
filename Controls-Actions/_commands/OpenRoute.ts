import { location } from 'Application/Env';

interface IOpenLinkOptions {
    route: string;
}

/**
 * Действие перехода по пути
 *
 * @public
 */
class OpenRoute {
    execute({ route }: IOpenLinkOptions): void {
        if (route) {
            const resolvedRoute = route[0] === '/' ? route : `/${route}`;

            window.open(`${location.protocol}//${location.host}${resolvedRoute}`, '_blank');
        }
    }
}

export default OpenRoute;
