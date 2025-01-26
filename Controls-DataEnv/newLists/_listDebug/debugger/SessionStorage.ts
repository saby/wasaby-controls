import { Session } from './Session';

export class SessionStorage {
    private _sessions: Set<Session> = new Set();

    addSession(session: Session): this {
        if (this._sessions.has(session)) {
            // TODO
            throw Error('!!!');
        }
        this._sessions.add(session);
        return this;
    }

    deleteSession(session: Session) {
        if (!this._sessions.has(session)) {
            // TODO
            throw Error('!!!');
        }
        this._sessions.delete(session);
    }

    private static instance: SessionStorage;

    static getInstance() {
        if (!SessionStorage.instance) {
            SessionStorage.instance = new SessionStorage();
        }
        return SessionStorage.instance;
    }
}
