/**
 * Color token manifest — generated from design.pen (Pencil MCP handoff).
 * 실제 스타일 값은 src/styles/tokens.css 의 CSS 커스텀 프로퍼티가 소스입니다.
 */

export interface ColorShade {
  step: string;
  token: string;
  cssVar: string;
  hex: string;
  /** color-neutral-50 위에 올렸을 때의 WCAG 대비율. 알파 팔레트는 null */
  contrastOnNeutral50: number | null;
}

export interface ColorPalette {
  name: string;
  prefix: string;
  /** 알파(반투명) 팔레트 여부 — 스와치 렌더 시 체커보드 배경 필요 */
  alpha: boolean;
  shades: ColorShade[];
}

export interface SemanticColorToken {
  token: string;
  cssVar: string;
  /** 참조하는 프리미티브 토큰 이름 */
  ref: string;
  hex: string;
}

export interface SemanticColorGroup {
  name: string;
  tokens: SemanticColorToken[];
}

export const primitivePalettes: ColorPalette[] = [
  {
    "name": "Brand / Orange",
    "prefix": "brand",
    "alpha": false,
    "shades": [
      {
        "step": "50",
        "token": "color-brand-50",
        "cssVar": "--color-brand-50",
        "hex": "#FFF4ED",
        "contrastOnNeutral50": 1.06
      },
      {
        "step": "100",
        "token": "color-brand-100",
        "cssVar": "--color-brand-100",
        "hex": "#FFE4D5",
        "contrastOnNeutral50": 1.19
      },
      {
        "step": "200",
        "token": "color-brand-200",
        "cssVar": "--color-brand-200",
        "hex": "#FFC5A8",
        "contrastOnNeutral50": 1.5
      },
      {
        "step": "300",
        "token": "color-brand-300",
        "cssVar": "--color-brand-300",
        "hex": "#FF9D73",
        "contrastOnNeutral50": 2
      },
      {
        "step": "400",
        "token": "color-brand-400",
        "cssVar": "--color-brand-400",
        "hex": "#FF7A47",
        "contrastOnNeutral50": 2.54
      },
      {
        "step": "500",
        "token": "color-brand-500",
        "cssVar": "--color-brand-500",
        "hex": "#FF6B35",
        "contrastOnNeutral50": 2.79
      },
      {
        "step": "600",
        "token": "color-brand-600",
        "cssVar": "--color-brand-600",
        "hex": "#E84F1E",
        "contrastOnNeutral50": 3.71
      },
      {
        "step": "700",
        "token": "color-brand-700",
        "cssVar": "--color-brand-700",
        "hex": "#BF3B16",
        "contrastOnNeutral50": 5.36
      },
      {
        "step": "800",
        "token": "color-brand-800",
        "cssVar": "--color-brand-800",
        "hex": "#993218",
        "contrastOnNeutral50": 7.31
      },
      {
        "step": "900",
        "token": "color-brand-900",
        "cssVar": "--color-brand-900",
        "hex": "#7C2E19",
        "contrastOnNeutral50": 9.13
      },
      {
        "step": "950",
        "token": "color-brand-950",
        "cssVar": "--color-brand-950",
        "hex": "#431407",
        "contrastOnNeutral50": 15.39
      }
    ]
  },
  {
    "name": "Neutral / Warm Paper",
    "prefix": "neutral",
    "alpha": false,
    "shades": [
      {
        "step": "50",
        "token": "color-neutral-50",
        "cssVar": "--color-neutral-50",
        "hex": "#FFFDF7",
        "contrastOnNeutral50": 1
      },
      {
        "step": "100",
        "token": "color-neutral-100",
        "cssVar": "--color-neutral-100",
        "hex": "#F7F1E8",
        "contrastOnNeutral50": 1.1
      },
      {
        "step": "200",
        "token": "color-neutral-200",
        "cssVar": "--color-neutral-200",
        "hex": "#E9E2DA",
        "contrastOnNeutral50": 1.26
      },
      {
        "step": "300",
        "token": "color-neutral-300",
        "cssVar": "--color-neutral-300",
        "hex": "#CFC4B8",
        "contrastOnNeutral50": 1.69
      },
      {
        "step": "400",
        "token": "color-neutral-400",
        "cssVar": "--color-neutral-400",
        "hex": "#A99E93",
        "contrastOnNeutral50": 2.58
      },
      {
        "step": "500",
        "token": "color-neutral-500",
        "cssVar": "--color-neutral-500",
        "hex": "#79736D",
        "contrastOnNeutral50": 4.6
      },
      {
        "step": "600",
        "token": "color-neutral-600",
        "cssVar": "--color-neutral-600",
        "hex": "#635E56",
        "contrastOnNeutral50": 6.32
      },
      {
        "step": "700",
        "token": "color-neutral-700",
        "cssVar": "--color-neutral-700",
        "hex": "#4B463F",
        "contrastOnNeutral50": 9.19
      },
      {
        "step": "800",
        "token": "color-neutral-800",
        "cssVar": "--color-neutral-800",
        "hex": "#2F2B26",
        "contrastOnNeutral50": 13.81
      },
      {
        "step": "900",
        "token": "color-neutral-900",
        "cssVar": "--color-neutral-900",
        "hex": "#1F1F1F",
        "contrastOnNeutral50": 16.2
      },
      {
        "step": "950",
        "token": "color-neutral-950",
        "cssVar": "--color-neutral-950",
        "hex": "#11100E",
        "contrastOnNeutral50": 18.7
      }
    ]
  },
  {
    "name": "Warning / Amber",
    "prefix": "amber",
    "alpha": false,
    "shades": [
      {
        "step": "50",
        "token": "color-amber-50",
        "cssVar": "--color-amber-50",
        "hex": "#FFF8E6",
        "contrastOnNeutral50": 1.04
      },
      {
        "step": "100",
        "token": "color-amber-100",
        "cssVar": "--color-amber-100",
        "hex": "#FFEFC2",
        "contrastOnNeutral50": 1.12
      },
      {
        "step": "200",
        "token": "color-amber-200",
        "cssVar": "--color-amber-200",
        "hex": "#FFD980",
        "contrastOnNeutral50": 1.33
      },
      {
        "step": "300",
        "token": "color-amber-300",
        "cssVar": "--color-amber-300",
        "hex": "#FEC84B",
        "contrastOnNeutral50": 1.52
      },
      {
        "step": "400",
        "token": "color-amber-400",
        "cssVar": "--color-amber-400",
        "hex": "#F4A61D",
        "contrastOnNeutral50": 2
      },
      {
        "step": "500",
        "token": "color-amber-500",
        "cssVar": "--color-amber-500",
        "hex": "#D98200",
        "contrastOnNeutral50": 2.89
      },
      {
        "step": "600",
        "token": "color-amber-600",
        "cssVar": "--color-amber-600",
        "hex": "#B86400",
        "contrastOnNeutral50": 4.25
      },
      {
        "step": "700",
        "token": "color-amber-700",
        "cssVar": "--color-amber-700",
        "hex": "#8F4A00",
        "contrastOnNeutral50": 6.56
      },
      {
        "step": "800",
        "token": "color-amber-800",
        "cssVar": "--color-amber-800",
        "hex": "#713B07",
        "contrastOnNeutral50": 8.86
      },
      {
        "step": "900",
        "token": "color-amber-900",
        "cssVar": "--color-amber-900",
        "hex": "#5A320A",
        "contrastOnNeutral50": 10.89
      },
      {
        "step": "950",
        "token": "color-amber-950",
        "cssVar": "--color-amber-950",
        "hex": "#301804",
        "contrastOnNeutral50": 16.41
      }
    ]
  },
  {
    "name": "Success / Sage",
    "prefix": "sage",
    "alpha": false,
    "shades": [
      {
        "step": "50",
        "token": "color-sage-50",
        "cssVar": "--color-sage-50",
        "hex": "#F2F8F3",
        "contrastOnNeutral50": 1.06
      },
      {
        "step": "100",
        "token": "color-sage-100",
        "cssVar": "--color-sage-100",
        "hex": "#DDEBDD",
        "contrastOnNeutral50": 1.21
      },
      {
        "step": "200",
        "token": "color-sage-200",
        "cssVar": "--color-sage-200",
        "hex": "#BDD8C0",
        "contrastOnNeutral50": 1.5
      },
      {
        "step": "300",
        "token": "color-sage-300",
        "cssVar": "--color-sage-300",
        "hex": "#93BD99",
        "contrastOnNeutral50": 2.07
      },
      {
        "step": "400",
        "token": "color-sage-400",
        "cssVar": "--color-sage-400",
        "hex": "#6EA376",
        "contrastOnNeutral50": 2.88
      },
      {
        "step": "500",
        "token": "color-sage-500",
        "cssVar": "--color-sage-500",
        "hex": "#5F8B68",
        "contrastOnNeutral50": 3.84
      },
      {
        "step": "600",
        "token": "color-sage-600",
        "cssVar": "--color-sage-600",
        "hex": "#516B58",
        "contrastOnNeutral50": 5.74
      },
      {
        "step": "700",
        "token": "color-sage-700",
        "cssVar": "--color-sage-700",
        "hex": "#3F5646",
        "contrastOnNeutral50": 7.85
      },
      {
        "step": "800",
        "token": "color-sage-800",
        "cssVar": "--color-sage-800",
        "hex": "#314237",
        "contrastOnNeutral50": 10.51
      },
      {
        "step": "900",
        "token": "color-sage-900",
        "cssVar": "--color-sage-900",
        "hex": "#26342C",
        "contrastOnNeutral50": 12.82
      },
      {
        "step": "950",
        "token": "color-sage-950",
        "cssVar": "--color-sage-950",
        "hex": "#132019",
        "contrastOnNeutral50": 16.54
      }
    ]
  },
  {
    "name": "Info / Teal",
    "prefix": "teal",
    "alpha": false,
    "shades": [
      {
        "step": "50",
        "token": "color-teal-50",
        "cssVar": "--color-teal-50",
        "hex": "#ECFDF9",
        "contrastOnNeutral50": 1.03
      },
      {
        "step": "100",
        "token": "color-teal-100",
        "cssVar": "--color-teal-100",
        "hex": "#CCFBF1",
        "contrastOnNeutral50": 1.11
      },
      {
        "step": "200",
        "token": "color-teal-200",
        "cssVar": "--color-teal-200",
        "hex": "#99F6E4",
        "contrastOnNeutral50": 1.24
      },
      {
        "step": "300",
        "token": "color-teal-300",
        "cssVar": "--color-teal-300",
        "hex": "#5EEAD4",
        "contrastOnNeutral50": 1.45
      },
      {
        "step": "400",
        "token": "color-teal-400",
        "cssVar": "--color-teal-400",
        "hex": "#2DD4BF",
        "contrastOnNeutral50": 1.83
      },
      {
        "step": "500",
        "token": "color-teal-500",
        "cssVar": "--color-teal-500",
        "hex": "#2A9D8F",
        "contrastOnNeutral50": 3.27
      },
      {
        "step": "600",
        "token": "color-teal-600",
        "cssVar": "--color-teal-600",
        "hex": "#0F8176",
        "contrastOnNeutral50": 4.67
      },
      {
        "step": "700",
        "token": "color-teal-700",
        "cssVar": "--color-teal-700",
        "hex": "#0F665F",
        "contrastOnNeutral50": 6.69
      },
      {
        "step": "800",
        "token": "color-teal-800",
        "cssVar": "--color-teal-800",
        "hex": "#11524D",
        "contrastOnNeutral50": 8.83
      },
      {
        "step": "900",
        "token": "color-teal-900",
        "cssVar": "--color-teal-900",
        "hex": "#13423F",
        "contrastOnNeutral50": 10.99
      },
      {
        "step": "950",
        "token": "color-teal-950",
        "cssVar": "--color-teal-950",
        "hex": "#062725",
        "contrastOnNeutral50": 15.59
      }
    ]
  },
  {
    "name": "Error / Red",
    "prefix": "red",
    "alpha": false,
    "shades": [
      {
        "step": "50",
        "token": "color-red-50",
        "cssVar": "--color-red-50",
        "hex": "#FEF2F2",
        "contrastOnNeutral50": 1.08
      },
      {
        "step": "100",
        "token": "color-red-100",
        "cssVar": "--color-red-100",
        "hex": "#FEE2E2",
        "contrastOnNeutral50": 1.2
      },
      {
        "step": "200",
        "token": "color-red-200",
        "cssVar": "--color-red-200",
        "hex": "#FECACA",
        "contrastOnNeutral50": 1.42
      },
      {
        "step": "300",
        "token": "color-red-300",
        "cssVar": "--color-red-300",
        "hex": "#FCA5A5",
        "contrastOnNeutral50": 1.87
      },
      {
        "step": "400",
        "token": "color-red-400",
        "cssVar": "--color-red-400",
        "hex": "#F87171",
        "contrastOnNeutral50": 2.72
      },
      {
        "step": "500",
        "token": "color-red-500",
        "cssVar": "--color-red-500",
        "hex": "#EF4444",
        "contrastOnNeutral50": 3.7
      },
      {
        "step": "600",
        "token": "color-red-600",
        "cssVar": "--color-red-600",
        "hex": "#DC2626",
        "contrastOnNeutral50": 4.75
      },
      {
        "step": "700",
        "token": "color-red-700",
        "cssVar": "--color-red-700",
        "hex": "#B91C1C",
        "contrastOnNeutral50": 6.36
      },
      {
        "step": "800",
        "token": "color-red-800",
        "cssVar": "--color-red-800",
        "hex": "#991B1B",
        "contrastOnNeutral50": 8.17
      },
      {
        "step": "900",
        "token": "color-red-900",
        "cssVar": "--color-red-900",
        "hex": "#7F1D1D",
        "contrastOnNeutral50": 9.85
      },
      {
        "step": "950",
        "token": "color-red-950",
        "cssVar": "--color-red-950",
        "hex": "#450A0A",
        "contrastOnNeutral50": 15.87
      }
    ]
  },
  {
    "name": "Overlay / White Alpha",
    "prefix": "alpha-white",
    "alpha": true,
    "shades": [
      {
        "step": "0",
        "token": "color-alpha-white-0",
        "cssVar": "--color-alpha-white-0",
        "hex": "#FFFFFF00",
        "contrastOnNeutral50": null
      },
      {
        "step": "10",
        "token": "color-alpha-white-10",
        "cssVar": "--color-alpha-white-10",
        "hex": "#FFFFFF1A",
        "contrastOnNeutral50": null
      },
      {
        "step": "27",
        "token": "color-alpha-white-27",
        "cssVar": "--color-alpha-white-27",
        "hex": "#FFFFFF44",
        "contrastOnNeutral50": null
      },
      {
        "step": "60",
        "token": "color-alpha-white-60",
        "cssVar": "--color-alpha-white-60",
        "hex": "#FFFFFF99",
        "contrastOnNeutral50": null
      }
    ]
  },
  {
    "name": "Overlay / Black Alpha",
    "prefix": "alpha-black",
    "alpha": true,
    "shades": [
      {
        "step": "0",
        "token": "color-alpha-black-0",
        "cssVar": "--color-alpha-black-0",
        "hex": "#00000000",
        "contrastOnNeutral50": null
      },
      {
        "step": "4",
        "token": "color-alpha-black-4",
        "cssVar": "--color-alpha-black-4",
        "hex": "#4D24100A",
        "contrastOnNeutral50": null
      },
      {
        "step": "5",
        "token": "color-alpha-black-5",
        "cssVar": "--color-alpha-black-5",
        "hex": "#2D1A100D",
        "contrastOnNeutral50": null
      },
      {
        "step": "9",
        "token": "color-alpha-black-9",
        "cssVar": "--color-alpha-black-9",
        "hex": "#4B2A180D",
        "contrastOnNeutral50": null
      },
      {
        "step": "13",
        "token": "color-alpha-black-13",
        "cssVar": "--color-alpha-black-13",
        "hex": "#00000022",
        "contrastOnNeutral50": null
      },
      {
        "step": "20",
        "token": "color-alpha-black-20",
        "cssVar": "--color-alpha-black-20",
        "hex": "#A23A1833",
        "contrastOnNeutral50": null
      },
      {
        "step": "30",
        "token": "color-alpha-black-30",
        "cssVar": "--color-alpha-black-30",
        "hex": "#0000004D",
        "contrastOnNeutral50": null
      },
      {
        "step": "50",
        "token": "color-alpha-black-50",
        "cssVar": "--color-alpha-black-50",
        "hex": "#00000080",
        "contrastOnNeutral50": null
      },
      {
        "step": "54",
        "token": "color-alpha-black-54",
        "cssVar": "--color-alpha-black-54",
        "hex": "#0000008A",
        "contrastOnNeutral50": null
      },
      {
        "step": "72",
        "token": "color-alpha-black-72",
        "cssVar": "--color-alpha-black-72",
        "hex": "#000000B8",
        "contrastOnNeutral50": null
      },
      {
        "step": "95",
        "token": "color-alpha-black-95",
        "cssVar": "--color-alpha-black-95",
        "hex": "#000000F2",
        "contrastOnNeutral50": null
      }
    ]
  }
];

export const semanticColorGroups: SemanticColorGroup[] = [
  {
    "name": "Text",
    "tokens": [
      {
        "token": "color-text-brand",
        "cssVar": "--color-text-brand",
        "ref": "color-brand-700",
        "hex": "#BF3B16"
      },
      {
        "token": "color-text-default",
        "cssVar": "--color-text-default",
        "ref": "color-neutral-900",
        "hex": "#1F1F1F"
      },
      {
        "token": "color-text-error",
        "cssVar": "--color-text-error",
        "ref": "color-red-600",
        "hex": "#DC2626"
      },
      {
        "token": "color-text-info",
        "cssVar": "--color-text-info",
        "ref": "color-teal-700",
        "hex": "#0F665F"
      },
      {
        "token": "color-text-inverse",
        "cssVar": "--color-text-inverse",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-text-muted",
        "cssVar": "--color-text-muted",
        "ref": "color-neutral-600",
        "hex": "#635E56"
      },
      {
        "token": "color-text-on-brand",
        "cssVar": "--color-text-on-brand",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-text-on-error",
        "cssVar": "--color-text-on-error",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-text-on-info",
        "cssVar": "--color-text-on-info",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-text-on-success",
        "cssVar": "--color-text-on-success",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-text-on-warning",
        "cssVar": "--color-text-on-warning",
        "ref": "color-neutral-950",
        "hex": "#11100E"
      },
      {
        "token": "color-text-placeholder",
        "cssVar": "--color-text-placeholder",
        "ref": "color-neutral-500",
        "hex": "#79736D"
      },
      {
        "token": "color-text-subtle",
        "cssVar": "--color-text-subtle",
        "ref": "color-neutral-500",
        "hex": "#79736D"
      },
      {
        "token": "color-text-success",
        "cssVar": "--color-text-success",
        "ref": "color-sage-700",
        "hex": "#3F5646"
      },
      {
        "token": "color-text-warning",
        "cssVar": "--color-text-warning",
        "ref": "color-amber-800",
        "hex": "#713B07"
      }
    ]
  },
  {
    "name": "Background",
    "tokens": [
      {
        "token": "color-background-brand",
        "cssVar": "--color-background-brand",
        "ref": "color-brand-500",
        "hex": "#FF6B35"
      },
      {
        "token": "color-background-brand-selected",
        "cssVar": "--color-background-brand-selected",
        "ref": "color-brand-50",
        "hex": "#FFF4ED"
      },
      {
        "token": "color-background-brand-subtle",
        "cssVar": "--color-background-brand-subtle",
        "ref": "color-brand-50",
        "hex": "#FFF4ED"
      },
      {
        "token": "color-background-card",
        "cssVar": "--color-background-card",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-background-default",
        "cssVar": "--color-background-default",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-background-disabled",
        "cssVar": "--color-background-disabled",
        "ref": "color-neutral-300",
        "hex": "#CFC4B8"
      },
      {
        "token": "color-background-error",
        "cssVar": "--color-background-error",
        "ref": "color-red-600",
        "hex": "#DC2626"
      },
      {
        "token": "color-background-error-subtle",
        "cssVar": "--color-background-error-subtle",
        "ref": "color-red-50",
        "hex": "#FEF2F2"
      },
      {
        "token": "color-background-info",
        "cssVar": "--color-background-info",
        "ref": "color-teal-600",
        "hex": "#0F8176"
      },
      {
        "token": "color-background-info-subtle",
        "cssVar": "--color-background-info-subtle",
        "ref": "color-teal-50",
        "hex": "#ECFDF9"
      },
      {
        "token": "color-background-inverse",
        "cssVar": "--color-background-inverse",
        "ref": "color-neutral-900",
        "hex": "#1F1F1F"
      },
      {
        "token": "color-background-media-placeholder",
        "cssVar": "--color-background-media-placeholder",
        "ref": "color-brand-100",
        "hex": "#FFE4D5"
      },
      {
        "token": "color-background-muted",
        "cssVar": "--color-background-muted",
        "ref": "color-neutral-200",
        "hex": "#E9E2DA"
      },
      {
        "token": "color-background-screen",
        "cssVar": "--color-background-screen",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-background-screen-warm",
        "cssVar": "--color-background-screen-warm",
        "ref": "color-brand-50",
        "hex": "#FFF4ED"
      },
      {
        "token": "color-background-scrim",
        "cssVar": "--color-background-scrim",
        "ref": "color-alpha-black-50",
        "hex": "#00000080"
      },
      {
        "token": "color-background-success",
        "cssVar": "--color-background-success",
        "ref": "color-sage-600",
        "hex": "#516B58"
      },
      {
        "token": "color-background-success-subtle",
        "cssVar": "--color-background-success-subtle",
        "ref": "color-sage-50",
        "hex": "#F2F8F3"
      },
      {
        "token": "color-background-surface",
        "cssVar": "--color-background-surface",
        "ref": "color-neutral-100",
        "hex": "#F7F1E8"
      },
      {
        "token": "color-background-transparent",
        "cssVar": "--color-background-transparent",
        "ref": "color-alpha-white-0",
        "hex": "#FFFFFF00"
      },
      {
        "token": "color-background-warning",
        "cssVar": "--color-background-warning",
        "ref": "color-amber-500",
        "hex": "#D98200"
      },
      {
        "token": "color-background-warning-subtle",
        "cssVar": "--color-background-warning-subtle",
        "ref": "color-amber-50",
        "hex": "#FFF8E6"
      }
    ]
  },
  {
    "name": "Border",
    "tokens": [
      {
        "token": "color-border-brand",
        "cssVar": "--color-border-brand",
        "ref": "color-brand-300",
        "hex": "#FF9D73"
      },
      {
        "token": "color-border-default",
        "cssVar": "--color-border-default",
        "ref": "color-neutral-200",
        "hex": "#E9E2DA"
      },
      {
        "token": "color-border-error",
        "cssVar": "--color-border-error",
        "ref": "color-red-200",
        "hex": "#FECACA"
      },
      {
        "token": "color-border-error-strong",
        "cssVar": "--color-border-error-strong",
        "ref": "color-red-600",
        "hex": "#DC2626"
      },
      {
        "token": "color-border-info",
        "cssVar": "--color-border-info",
        "ref": "color-teal-300",
        "hex": "#5EEAD4"
      },
      {
        "token": "color-border-strong",
        "cssVar": "--color-border-strong",
        "ref": "color-neutral-300",
        "hex": "#CFC4B8"
      },
      {
        "token": "color-border-success",
        "cssVar": "--color-border-success",
        "ref": "color-sage-300",
        "hex": "#93BD99"
      },
      {
        "token": "color-border-warning",
        "cssVar": "--color-border-warning",
        "ref": "color-amber-300",
        "hex": "#FEC84B"
      }
    ]
  },
  {
    "name": "Icon",
    "tokens": [
      {
        "token": "color-icon-brand",
        "cssVar": "--color-icon-brand",
        "ref": "color-brand-500",
        "hex": "#FF6B35"
      },
      {
        "token": "color-icon-default",
        "cssVar": "--color-icon-default",
        "ref": "color-neutral-900",
        "hex": "#1F1F1F"
      },
      {
        "token": "color-icon-error",
        "cssVar": "--color-icon-error",
        "ref": "color-red-600",
        "hex": "#DC2626"
      },
      {
        "token": "color-icon-inverse",
        "cssVar": "--color-icon-inverse",
        "ref": "color-neutral-50",
        "hex": "#FFFDF7"
      },
      {
        "token": "color-icon-muted",
        "cssVar": "--color-icon-muted",
        "ref": "color-neutral-400",
        "hex": "#A99E93"
      }
    ]
  },
  {
    "name": "Overlay",
    "tokens": [
      {
        "token": "color-overlay-hero-mark-muted",
        "cssVar": "--color-overlay-hero-mark-muted",
        "ref": "color-alpha-white-60",
        "hex": "#FFFFFF99"
      },
      {
        "token": "color-overlay-photo-bottom-end",
        "cssVar": "--color-overlay-photo-bottom-end",
        "ref": "color-alpha-black-54",
        "hex": "#0000008A"
      },
      {
        "token": "color-overlay-photo-bottom-mid",
        "cssVar": "--color-overlay-photo-bottom-mid",
        "ref": "color-alpha-black-30",
        "hex": "#0000004D"
      },
      {
        "token": "color-overlay-photo-bottom-start",
        "cssVar": "--color-overlay-photo-bottom-start",
        "ref": "color-alpha-black-0",
        "hex": "#00000000"
      },
      {
        "token": "color-overlay-photo-dark-high",
        "cssVar": "--color-overlay-photo-dark-high",
        "ref": "color-alpha-black-72",
        "hex": "#000000B8"
      },
      {
        "token": "color-overlay-photo-dark-low",
        "cssVar": "--color-overlay-photo-dark-low",
        "ref": "color-alpha-black-13",
        "hex": "#00000022"
      },
      {
        "token": "color-overlay-photo-dark-solid",
        "cssVar": "--color-overlay-photo-dark-solid",
        "ref": "color-alpha-black-95",
        "hex": "#000000F2"
      },
      {
        "token": "color-overlay-photo-light-mid",
        "cssVar": "--color-overlay-photo-light-mid",
        "ref": "color-alpha-white-10",
        "hex": "#FFFFFF1A"
      },
      {
        "token": "color-overlay-photo-light-start",
        "cssVar": "--color-overlay-photo-light-start",
        "ref": "color-alpha-white-27",
        "hex": "#FFFFFF44"
      }
    ]
  },
  {
    "name": "Shadow",
    "tokens": [
      {
        "token": "color-shadow-brand",
        "cssVar": "--color-shadow-brand",
        "ref": "color-alpha-black-20",
        "hex": "#A23A1833"
      },
      {
        "token": "color-shadow-card",
        "cssVar": "--color-shadow-card",
        "ref": "color-alpha-black-9",
        "hex": "#4B2A180D"
      },
      {
        "token": "color-shadow-header",
        "cssVar": "--color-shadow-header",
        "ref": "color-alpha-black-4",
        "hex": "#4D24100A"
      },
      {
        "token": "color-shadow-soft",
        "cssVar": "--color-shadow-soft",
        "ref": "color-alpha-black-5",
        "hex": "#2D1A100D"
      }
    ]
  }
];
