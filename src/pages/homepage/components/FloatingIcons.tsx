import React from "react";

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

const BuyIcon = React.memo(({ className = "", style = {} }: IconProps) => (
  <div className={`w-44 h-44 ${className}`} style={style}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="rgba(46, 204, 113, 0.3)"
        strokeWidth="4"
      />
      <path
        d="M50 30V70M50 30L35 45M50 30L65 45"
        stroke="#2ecc71"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));

const SellIcon = React.memo(({ className = "", style = {} }: IconProps) => (
  <div className={`w-32 h-32 ${className}`} style={style}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="rgba(231, 76, 60, 0.3)"
        strokeWidth="4"
      />
      <path
        d="M50 70V30M50 70L35 55M50 70L65 55"
        stroke="#e74c3c"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));

const CoinIcon = React.memo(({ className = "", style = {} }: IconProps) => (
  <div className={`w-32 h-32 ${className}`} style={style}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="url(#coin-gradient)" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="40"
        fill="#000814"
        fontFamily="Algance"
        fontWeight="bold"
      >
        $
      </text>
      <defs>
        <radialGradient id="coin-gradient" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffd60a" />
          <stop offset="100%" stopColor="#fca311" />
        </radialGradient>
      </defs>
    </svg>
  </div>
));

const GraphIcon = React.memo(({ className = "", style = {} }: IconProps) => (
  <div className={`w-32 h-32 ${className}`} style={style}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 80 L30 60 L50 70 L70 40 L90 50"
        stroke="rgba(252, 163, 17, 0.5)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="10"
        stroke="rgba(20, 33, 61, 0.3)"
        strokeWidth="4"
      />
    </svg>
  </div>
));

const FloatingIcons: React.FC = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <BuyIcon
      className="absolute top-[15%] left-[5%] opacity-20 animate-float-complex"
      style={{ animationDuration: "12s" }}
    />
    <SellIcon
      className="absolute top-[60%] right-[5%] opacity-20 animate-float-complex"
      style={{ animationDuration: "18s", animationDelay: "3s" }}
    />
    <CoinIcon
      className="absolute bottom-[5%] left-[15%] opacity-10 animate-float-complex"
      style={{ animationDuration: "20s", animationDelay: "1s" }}
    />
    <GraphIcon
      className="absolute top-[20%] right-[20%] opacity-15 animate-float-complex"
      style={{ animationDuration: "16s", animationDelay: "2s" }}
    />
    <SellIcon
      className="absolute top-[5%] right-[20%] opacity-20 animate-float-complex"
      style={{ animationDuration: "18s", animationDelay: "3s" }}
    />
    <CoinIcon
      className="absolute top-[5%] left-[20%] opacity-10 animate-float-complex"
      style={{ animationDuration: "14s", animationDelay: "4s" }}
    />
    <CoinIcon
      className="absolute top-[70%] left-[40%] opacity-15 animate-float-complex w-16 h-16"
      style={{ animationDuration: "14s", animationDelay: "4s" }}
    />
    <BuyIcon
      className="absolute bottom-[10%] right-[30%] opacity-20 animate-float-complex w-16 h-16"
      style={{ animationDuration: "17s", animationDelay: "5s" }}
    />
  </div>
));

export default FloatingIcons;
