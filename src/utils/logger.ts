import chalk from "chalk";

const { bgBlue, black, green } = chalk;
const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV as
  | "development"
  | "production";

function dateTimePad(value: number | string, digits: number): string {
  let number = value.toString();
  while (number.length < digits) {
    number = "0" + number;
  }
  return number;
}

function format(tDate: Date): string {
  return (
    tDate.getFullYear() +
    "-" +
    dateTimePad(tDate.getMonth() + 1, 2) +
    "-" +
    dateTimePad(tDate.getDate(), 2) +
    " " +
    dateTimePad(tDate.getHours(), 2) +
    ":" +
    dateTimePad(tDate.getMinutes(), 2) +
    ":" +
    dateTimePad(tDate.getSeconds(), 2) +
    "." +
    dateTimePad(tDate.getMilliseconds(), 3)
  );
}

type LogType =
  | "log"
  | "warn"
  | "error"
  | "debug"
  | "cmd"
  | "ready"
  | "complete"
  | "docs"
  | "mngdb"
  | "reconnecting"
  | "disconnecting"
  | "load"
  | "varn"
  | "caution"
  | "category";

export default class Logger {
  static log(content: string, type: LogType = "log"): void {
    const date = `[${format(new Date())}]:`;

    const typeStyles: Record<LogType, string> = {
      log: bgBlue("LOG"),
      warn: black.bgHex("#D9A384")("WARN"),
      error: black.bgHex("#FF0000")("ERROR"),
      debug: green("DEBUG"),
      cmd: black.bgHex("#8dbe85")("CMD"),
      ready: black.bgHex("#48D09B")("READY"),
      complete: black.bgHex("#CCFFCC")("COMPLETE"),
      docs: black.bgHex("#A9D4D9")("DOCS"),
      mngdb: black.bgHex("#F9D342")("MNGDB"),
      reconnecting: black.bgHex("#133729")("RECONNECTING"),
      disconnecting: black.bgHex("#782020")("DISCONNECTING"),
      load: black.bgHex("#7B78B4")("LOAD"),
      varn: black.bgHex("#EEA2AD")("VARN"),
      caution: black.bgHex("#FF0000")("CAUTION"),
      category: black.bgHex("#E8D4A9")("CATEGORY"),
    };

    const style = typeStyles[type] || bgBlue("UNKNOWN");
    if (NODE_ENV === "development") console.log(`${date} ${style} ${content}`);
    else return;
  }
}
