declare module "qrcode.react" {
  import * as React from "react";

  export interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    includeMargin?: boolean;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export const QRCodeSVG: React.ComponentType<QRCodeProps>;
  export const QRCodeCanvas: React.ComponentType<QRCodeProps>;
}
