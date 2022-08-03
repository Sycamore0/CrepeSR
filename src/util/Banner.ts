import fs from 'fs';
import { resolve } from 'path';
import { VerboseLevel } from './Logger';

const BANNERS = [
    {
        gachaId: 1001,
        detailWebview: "",
        rateUpItems4: [
            1001, 1103
        ],
        rateUpItems5: [
            1102
        ],
        costItemId: -1 //unused for now
    } as Banner
]

type BannersConfig = typeof BANNERS;
type Banner = {
    gachaId: number,
    detailWebview: string,
    rateUpItems4: number[],
    rateUpItems5: number[],
    costItemId: number
}

function r(...args: string[]) {
    return fs.readFileSync(resolve(__dirname, ...args)).toString();
}


function readConfig(): any {
    let config: BannersConfig;
    try {
        config = JSON.parse(r('../../banners.json'));
        
        for(const [index, gachaBanner] of Object.entries(config)){
            const missing = Object.keys(BANNERS[0]).filter(key => !gachaBanner.hasOwnProperty(key));
            if (missing.length > 0) {
                console.log(missing)
                updateConfig(config);
                console.log(`Added missing banners keys: ${missing.join(', ')}`);
            }
        }
    } catch {
        console.error("Could not read banners file. Creating one for you...");
        config = BANNERS;
        updateConfig(config);
    }
    return config;
}

function updateConfig(config: any) {
    fs.writeFileSync('./banners.json', JSON.stringify(config, null, 2));
}

export default class Banners {
    public static config = readConfig();
    public static banners = Object.values(Banners.config) as Banner[];

    private constructor() { }
}
