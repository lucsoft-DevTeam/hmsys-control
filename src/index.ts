import { WebGen, SupportedThemes } from "@lucsoft/webgen";
import './style/master.css'
import './style/dashboard.css'
const web = new WebGen()
web.ready = async () =>
{
    import('./views/container').then((home) => home.render(web))
}

web.enable(SupportedThemes.auto)