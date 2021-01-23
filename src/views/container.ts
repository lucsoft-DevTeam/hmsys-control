import type { WebGen } from '@lucsoft/webgen';
import { drawNodelist } from '../components/nodeList';
import noImage from '../../res/star.png';
import { renderDashboard } from './dashboard';

export function render(web: WebGen)
{
    const content = web.elements.body()

    const dashBackground = document.createElement('div')
    dashBackground.classList.add('dashbackground')

    const data = drawNodelist(dashBackground, [
        {
            id: "eu01",
            displayText: "EU01",
            onClick: () => renderDashboard(0, dashBoard, web, data)
        },
        {
            id: "qt01",
            displayText: "QT01",
            img: noImage,
            onClick: () => renderDashboard(1, dashBoard, web, data)
        }
    ])
    const dashBoard = document.createElement('div')
    renderDashboard(0, dashBoard, web, data)
    dashBackground.append(dashBoard)
    content.custom({ element: dashBackground })
}