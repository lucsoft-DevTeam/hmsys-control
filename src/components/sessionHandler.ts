export type SessionInstance = {
    url: string,
    id: string,
    getAuth: (type: "noTokenFound" | "notAccepted") => Promise<({ email: string, password: string })>,
    onConnect?: () => void,
    onAuthed?: (email: string) => void,
    onDisconnect?: () => void,
    onMessage: (message: any, reply: (rsp: any) => void) => void,
    socket?: WebSocket
}

export const sessions: SessionInstance[] = [];

export function createConnection(inst: SessionInstance)
{
    const find = sessions.find(x => x.id === inst.id);
    if (find !== undefined)
    {
        find.socket?.close()
        find.getAuth = inst.getAuth;
        find.onAuthed = inst.onAuthed;
        find.onConnect = inst.onConnect;
        find.onDisconnect = inst.onDisconnect;
        find.onMessage = inst.onMessage;
        find.url = inst.url;
    };
    const auth = () => ({
        token: localStorage.getItem(`${inst.id}AuthToken`),
        id: localStorage.getItem(`${inst.id}AuthId`)
    });
    const socket = new WebSocket(inst.url);
    socket.onmessage = (x) =>
    {
        try
        {
            const data = JSON.parse(x.data)
            if (data.login == "require authentication")
            {
                const token = localStorage.getItem(`${inst.id}AuthToken`)
                const id = localStorage.getItem(`${inst.id}AuthId`)

                if (token && id)
                {
                    socket.send(JSON.stringify({
                        action: "login",
                        type: "client",
                        token,
                        id
                    }))
                } else
                {
                    inst.getAuth("noTokenFound").then(x =>
                    {
                        socket.send(JSON.stringify({
                            action: "login",
                            type: "client",
                            email: x.email,
                            password: x.password
                        }))
                    })
                }
            } else if (data.login == false)
            {
                inst.getAuth("notAccepted").then(x =>
                {
                    socket.send(JSON.stringify({
                        action: "login",
                        type: "client",
                        email: x.email,
                        password: x.password
                    }))
                })
            } else if (data.login == true)
            {
                localStorage.setItem(`${inst.id}AuthToken`, data.client.token)
                localStorage.setItem(`${inst.id}AuthId`, data.client.id)
                inst.onAuthed?.(data.client.email)
            } else
                inst.onMessage(data, (rsp) => socket.send(JSON.stringify({ ...rsp, auth: auth() })))
        } catch (error)
        {
            console.error(error);
        }
    };
    socket.onopen = () => inst.onConnect?.()
    socket.onclose = () => inst.onDisconnect?.()
    socket.onerror = () => inst.onDisconnect?.()
    sessions.push({ ...inst, socket })
    return { reply: (rsp: any) => socket.send(JSON.stringify({ ...rsp, auth: auth() })) };
}