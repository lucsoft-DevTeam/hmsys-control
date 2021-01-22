import { cards, WebGen } from '@lucsoft/webgen';
import { HeadlessCard } from '@lucsoft/webgen/bin/lib/Cards';
import type { NodeListElement } from '../components/nodeList';
import { createConnection } from '../components/sessionHandler';
import { usageCard } from '../components/usageCard';

export function renderDashboard(id: number, ele: HTMLElement, web: WebGen, nav: () => NodeListElement[])
{
    ele.innerHTML = "";
    ele.classList.add('dashboard');
    nav().forEach((x, i) => x.toggleState?.(i == id))
    const shell = document.createElement('article');
    const navElement = nav()[ id ];

    const log = document.createElement('div');
    log.classList.add('logs');
    const url = location.search.substr(1).split(/[&]/).find(x => x.startsWith('ip'))?.split('=')[ 1 ] ?? "eu01.hmsys.de";
    const connection = createConnection({
        id: navElement.id,
        url: "wss://" + url,
        getAuth: () => new Promise(tempLogin =>
        {
            tempLogin({ email: "default@lucsoft.de", password: "HAH LOL LOOING FOR A PASSWORD?" })
        }),



        onAuthed: (mail) => uiLog("info", `Signed in as ` + mail),
        onConnect: () => uiLog("info", "Connected to " + "wss://" + url),
        onDisconnect: () => uiLog("error", "Disconnected from Server"),
        onMessage: (data) =>
        {
            console.log(data)

            if (data.type == "sync" && data.data.syncType == "targetHandler" && data.data.type.startsWith('@hmsys/dashboard:'))
            {
                const command = data.data.type.split(/:(.+)/)[ 1 ];
                if (command == "@hmsys/dashboard:help" || command == "@hmsys/dashboard:commands")
                {
                    uiLog("info", `Registered Commands (${data.data.commands}): \n` + data.data.entires.map((x: any) => x.from + ":" + x.alias[ 0 ] + " — alternative: " + x.alias.splice(1, (x.alias.length / 2) - 1).join(' ')).join('\n'));

                }
                else
                    uiLog("system", JSON.stringify(data.data));
            } else
                uiLog("system", JSON.stringify(data));

        }
    })
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input')
    const span = document.createElement('span');
    span.innerText = "🔓 $";
    inputDiv.append(span);
    const input = document.createElement('input')
    input.onkeydown = (e) =>
    {
        if (e.key == "Tab") e.preventDefault();
    }
    let tabCount = 0;
    input.autofocus = true;
    input.onkeyup = (e) =>
    {
        if (e.key == "Tab")
        {
            tabCount++;
        } else
            tabCount = 0;
    }
    input.onkeypress = (e) =>
    {
        if (e.key !== "Enter")
            return;
        connection.reply({
            action: "trigger",
            type: "@hmsys/dashboard",
            data: {
                action: input.value.split(' ')[ 0 ]
            }
        });
        uiLog("send", input.value || "\n")
        input.value = "";
    }
    inputDiv.append(input);
    log.append(inputDiv);
    const uiLog = (type: "send" | "info" | "system" | "error", message: string) =>
    {
        const msg = document.createElement('span');
        msg.classList.add('logs', 'msg', type);
        msg.innerText = message;
        log.append(msg)
    };

    const view = web.elements.custom(shell);
    view
        .pageTitle({ text: nav()[ id ].displayText })
        .custom({ element: document.createElement('br') })
        .cards({ minColumnWidth: 13 },
            cards.richCard({
                title: 'Terminal Interface',
                content: log,
                width: 4,
                height: 2
            }),
            usageCard({ CPU: 0, RAM: 0 }),
            cards.defaultCard({
                small: true,
                title: "0.00 0.00 0.00",
                subtitle: "Load Average",
                width: 1
            })
        )
    ele.append(shell);
}