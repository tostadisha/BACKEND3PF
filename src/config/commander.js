import { program } from "commander";

program.option("--logger <logger>", "Set logger mode", "DEVELOPMENT");

program.parse(process.argv); // <- Asegurar que parsea los argumentos de la CLI

export const option = program.opts();

console.log("Logger mode desde commander:", option.logger); // Debug
