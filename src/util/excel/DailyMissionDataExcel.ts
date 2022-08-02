import DailyMissionDataExcelTable from "../../data/excel/DailyMissionDataExcelTable.json";
import _DailyMissionRewardExcelTable from "../../data/excel/DailyMissionRewardExcelTable.json";
const DailyMissionRewardExcelTable: { [key: string]: DailyMissionRewardExcelTableEntry } = _DailyMissionRewardExcelTable;

interface DailyMissionRewardExcelTableEntry {
    WorldLevel: number;
    FinishCount: number;
    RewardID: number;
    ExtraRewardID: number;
}

export default class DailyMissionDataExcel {
    private constructor() { }

    public static fromId(id: number) {
        return Object.values(DailyMissionDataExcelTable).find(x => x.ID === id);
    }

    public static random(amount: number = 5) {
        const ids = Object.keys(DailyMissionDataExcelTable);
        const randomIds = [];
        for (let i = 0; i < amount; i++) {
            const id = ids[Math.floor(Math.random() * ids.length)];
            if (randomIds.indexOf(id) === -1) randomIds.push(id);
        }
        return randomIds.map(x => DailyMissionDataExcel.fromId(Number(x)));
    }

    public static getReward(finished: number, wl: number = 1) {
        const key = `${wl}:${finished}`;
        return DailyMissionRewardExcelTable[key];
    }
}