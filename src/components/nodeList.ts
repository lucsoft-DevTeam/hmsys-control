export type NodeListElement = {
    id: string,
    displayText: string,
    connected?: boolean,
    img?: string,
    toggleState?: (bool?: boolean) => boolean,
    onClick?: (node: NodeListElement) => void
}

export function drawNodelist(dashBackground: HTMLDivElement, arrayNodes: NodeListElement[]): () => NodeListElement[]
{
    const nodeList = document.createElement('div')
    nodeList.classList.add('nodelist')
    dashBackground.append(nodeList)

    arrayNodes.forEach((x, i) =>
    {
        const user = document.createElement('div')

        user.classList.add('usericon')
        if (x.connected)
            user.classList.add('connected')

        arrayNodes[ i ].toggleState = (e) =>
        {
            if (e !== undefined)
                if (e)
                    user.classList.add('connected')
                else
                    user.classList.remove('connected')
            else
                user.classList.toggle('connected')
            arrayNodes[ i ].connected = user.classList.contains('connected')
            return arrayNodes[ i ].connected ?? false;
        }
        user.innerHTML = (`<svg viewBox="0 0 54 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="background" ${x.img ? `style="fill: url(#img${i})"` : ''} fill-rule="evenodd" clip-rule="evenodd"/>
            ${x.img == undefined ? `<text class="textname" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${x.id}</text>` : ''}
            <rect class="iconBackground" x="37.0286" y="35.7173" width="16.9714" height="17.2174" rx="8.48571" fill="#3652EC" fill-opacity="0.42"/>
            <path class="iconForeground" d="M45.51 43.4c-.5 0-.92.43-.92.95s.41.95.92.95.93-.43.93-.95a.94.94 0 00-.93-.94zm2.78.95a2.8 2.8 0 00-3.12-2.8 2.85 2.85 0 00-1.5 4.92c.21.2.56.15.71-.12a.48.48 0 00-.1-.6 1.91 1.91 0 01-.56-1.86c.15-.67.69-1.21 1.34-1.37 1.22-.3 2.3.64 2.3 1.83a1.9 1.9 0 01-.61 1.4.49.49 0 00-.1.6c.14.25.47.32.7.13.57-.52.94-1.28.94-2.13zm-3.32-4.69a4.75 4.75 0 00-2.2 8.49c.22.16.54.1.67-.15a.48.48 0 00-.12-.6 3.8 3.8 0 011.77-6.8 3.73 3.73 0 014.13 3.75 3.8 3.8 0 01-1.52 3.04.48.48 0 00-.12.61c.14.25.46.31.68.15a4.73 4.73 0 001.88-3.8c0-2.79-2.37-5.01-5.17-4.69z" fill="#3F5AF3"/>
            ${x.img ? `<defs><pattern id="img${i}" patternUnits="userSpaceOnUse" width="55" height="55"><image href="${x.img}" x="0" y="0" width="55" height="55" /></pattern></defs>
            </svg>`: ''}`);
        user.onclick = () => x.onClick?.(x)

        nodeList.append(user)
    });
    return () => arrayNodes;
}