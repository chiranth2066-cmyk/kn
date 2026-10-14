declare module "liquid-gl" {
  export interface LiquidLens {
    el: HTMLElement;
    destroy(): void;
  }
  export interface LiquidOptions {
    target: string;
    snapshot?: string;
    content?: false | string;
    resolution?: number;
    refraction?: number;
    aberration?: number;
    bevelDepth?: number;
    bevelWidth?: number;
    frost?: number;
    shadow?: boolean;
    specular?: boolean;
    reveal?: "none" | "fade";
    tilt?: boolean;
    interaction?: "none" | "fluid";
    interactionStrength?: number;
    tint?: string | null;
    on?: { init: (lens: LiquidLens) => void };
  }
  const liquidGL: {
    (options: LiquidOptions): LiquidLens | LiquidLens[] | undefined;
  };
  export default liquidGL;
}