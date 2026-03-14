const utils = require("../../react/components/utils");
const utilsSrv = {};
utilsSrv.durationToMs = duration => {
    const match = duration.match(/^(\d+):(\d+):(\d+(?:\.\d+)?)$/);
    if (!match) throw new Error("Invalid duration format");

    const [, h, m, s] = match;

    return (
        Number(h) * 3600000 +
        Number(m) * 60000 +
        Math.round(Number(s) * 1000)
    );
}

utilsSrv.msToDuration = ms => {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;

    const minutes = Math.floor(ms / 60000);
    ms %= 60000;

    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    const fraction = String(milliseconds).padStart(3, "0") + "0000";

    return `${hh}:${mm}:${ss}.${fraction}`;
}

module.exports = utilsSrv;