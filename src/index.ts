import { WebGen, SupportedThemes } from "@lucsoft/webgen";

const web = new WebGen();

web.elements.body().title({
    type: "big",
    title: "Hello World!"
})

web.enable(SupportedThemes.auto);