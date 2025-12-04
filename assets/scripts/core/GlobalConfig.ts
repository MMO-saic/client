import { math, Size, Vec2, Node, Rect, Canvas } from "cc";
import { Replay } from "../data/Replay";
import { TileType } from "./TileType";

export class GlobalConfig {

    public static readonly MAX_SPEED = 8;
    public static readonly MIN_SPEED = 1;
    // 子弹基础飞行时间 
    public static readonly BASE_FLY_TIME = 0.4; //0.2;
    public static readonly BASE_DMG_TIME = 1.2; //0.2;
    // 菱形夹角的一半
    public static readonly RADIAN = math.toRadian(30);//math.toRadian(30);//math.toRadian(35);

    // 岩浆宽度 - now read from replay, default 16
    public static BORDER_SIZE = 16;
    public static readonly TILE_SIZE_25D = new Size(256, 285);// new Size(330, 262);// new Size(256, 284);
    public static readonly TILE_SIZE = new Size(128, 128);

    public static MapSize: number = 160;

    // 计算出来的地图像素 
    public static MapPixelSize: Size = new Size(128, 128);
    //  地块像素
    public static TilePixelSize = new Size(128, 128);
    // 真实地图像素  剔除岩浆 
    public static RealMapPixelSize: Size = new Size(128, 128);
    public static Border = 16;
    // 岩浆像素宽
    public static BorderWidth: number = GlobalConfig.TilePixelSize.x * GlobalConfig.BORDER_SIZE;

    public static LastDataMap: { [key: string]: any } = {};
    public static replay: Replay;
    public static step: number = 0;

    public static SpeedRate: number = 1;
    public static SpeedRates: number[] = [0.25, 0.5, 1, 2, 4, 8];

    public static Scales = [0.04, 0.1, 0.4, 0.8];
    public static ScaleIndex = 2;

    public static CurScale: number = 0.4;
    public static LastScale: number = 0.4;

    public static MinScale: number = 0.04;
    public static MaxScale: number = 0.8;

    public static ScaleStep: number = 0.1;

    // 600ms 执行一个packet 
    public static StepTick: number = 600;
    // 真实执行间隔 = StepTick / 倍速 毫秒
    public static get TickFrac() { return GlobalConfig.StepTick / GlobalConfig.SpeedRate; };

    public static Use25D: boolean = true;
    //   //  图片按菱形中心对齐 ,长的一半
    //   let w = GlobalConfig.TileSize.x / 2;

    //   // 菱形高度 
    //   let hH: number = w * Math.sin(GlobalConfig.RADIAN);

    // 菱形长，高
    public static RhombusSize: Size = new Size(GlobalConfig.TilePixelSize.x, GlobalConfig.TilePixelSize.x * Math.sin(GlobalConfig.RADIAN));
    // 菱形长，高 的一半 
    public static HRhombusSize: Size = new Size(GlobalConfig.RhombusSize.x / 2, GlobalConfig.RhombusSize.y / 2);

    // public static  sacleStep   GlobalConfig
    public static Pause: boolean = true;
    public static PosZIndexMap: { [key: string]: { type: TileType, value: number } } = {};
    
    public static isEnd: boolean = false;

    public   static  Viewport:Rect = new Rect();

    public   static  CanvasNode :Node;

    // Death fog config - read from replay if available, otherwise use these defaults
    // Values match battle_royale.py settings
    public static PLAYER_DEATH_FOG: number | null = 50;            // Fog onset tick (tick 50)
    public static PLAYER_DEATH_FOG_FINAL_SIZE: number = 8;         // Final safe zone radius
    public static PLAYER_DEATH_FOG_SPEED: number = 1;              // Shrink speed (1 tile per tick)

    // Initialize death fog config from replay data
    public static initDeathFogConfig(): void {
        console.log("[DeathFog] initDeathFogConfig called");
        if (GlobalConfig.replay && GlobalConfig.replay.packets && GlobalConfig.replay.packets.length > 0) {
            const packet = GlobalConfig.replay.packets[0];
            const config = packet.config;
            
            // Read border from packet (not config)
            if (packet.border !== undefined) {
                GlobalConfig.BORDER_SIZE = packet.border;
                console.log("[DeathFog] Set BORDER_SIZE from replay:", GlobalConfig.BORDER_SIZE);
            }
            
            console.log("[DeathFog] Found config in replay:", config);
            if (config) {
                // Read from replay config if available
                GlobalConfig.PLAYER_DEATH_FOG = config.PLAYER_DEATH_FOG;
                GlobalConfig.PLAYER_DEATH_FOG_FINAL_SIZE = config.PLAYER_DEATH_FOG_FINAL_SIZE ?? 8;
                GlobalConfig.PLAYER_DEATH_FOG_SPEED = config.PLAYER_DEATH_FOG_SPEED ?? 1;
                console.log("[DeathFog] Set values - onset:", GlobalConfig.PLAYER_DEATH_FOG, 
                    "finalSize:", GlobalConfig.PLAYER_DEATH_FOG_FINAL_SIZE,
                    "speed:", GlobalConfig.PLAYER_DEATH_FOG_SPEED);
            }
            // If no config in replay, keep the defaults (for older replay files)
        } else {
            console.log("[DeathFog] No replay or packets found, using defaults");
        }
    }
}