import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, RotateCcw, ChevronRight, Rocket, Fuel } from "lucide-react";
import { Language } from "../constants/languages";
import { SpaceBackground } from "./SpaceBackground";
import { getUiStrings } from "../../../../constants/strings";

interface TryAgainProps {
  totalCorrect: number;
  totalQuestions: number;
  selectedLanguage: Language;
  currentLevel: number;
  gameKey: string;
  onTryAgain: () => void;
  onBackToHome: () => void;
  livesLost?: boolean; // Flag to indicate if game ended due to lives lost
  fuelMode?: boolean; // Show fuel-based completion screen
  fuelCollected?: number; // Fuel collected
  fuelRequired?: number; // Fuel required to pass
  destination?: string; // Mission destination name
  useSpaceBackground?: boolean; // Use space background
}

export function TryAgain({ 
  totalCorrect, 
  totalQuestions, 
  selectedLanguage, 
  currentLevel,
  gameKey,
  onTryAgain, 
  onBackToHome,
  livesLost = false,
  fuelMode = false,
  fuelCollected = 0,
  fuelRequired = 0,
  destination = "",
  useSpaceBackground = false
}: TryAgainProps) {
  const ui = getUiStrings(selectedLanguage);
  const [isVisible, setIsVisible] = useState(false);
  const scorePercentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Add CSS for twinkle animation if not already added
  useEffect(() => {
    if (!document.getElementById('try-again-twinkle-style')) {
      const style = document.createElement('style');
      style.id = 'try-again-twinkle-style';
      style.textContent = `
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Add delay before showing the component for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // 200ms delay before showing
    
    return () => clearTimeout(timer);
  }, []);

  const content = (
    <div className={`h-full w-full flex items-center justify-center p-3 sm:p-4 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <Card className={`${fuelMode && useSpaceBackground ? 'w-full max-w-sm sm:max-w-md' : 'max-w-sm sm:max-w-md w-full'} ${fuelMode && useSpaceBackground ? 'bg-gradient-to-b from-slate-900/95 to-slate-800/95 border border-white/20' : 'bg-white/95 backdrop-blur-sm'} shadow-2xl transition-all duration-700 ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`} style={{
        ...(fuelMode && useSpaceBackground ? {
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)`,
          backgroundSize: '100% 100%',
          position: 'relative',
          maxHeight: 'calc(100vh - 200px)',
          height: 'auto',
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden'
        } : {
          width: '100%',
          maxWidth: '380px',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'hidden'
        })
      }}>
        {/* Starry background effect for fuel mode */}
        {fuelMode && useSpaceBackground && (
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        <div className="p-4 sm:p-5 text-center relative z-10">
          <div className="mb-3 sm:mb-4">
            {/* Rocket icon for fuel mode */}
            {fuelMode && (
              <div className="mb-3 flex justify-center">
                <Rocket className="h-12 w-12 sm:h-14 sm:w-14 text-red-500" />
              </div>
            )}
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 flex items-center justify-center gap-1">
              {livesLost ?
                <><span className="text-3xl sm:text-4xl animate-pulse">💔</span>
                <span className="text-3xl sm:text-4xl animate-pulse delay-100">💔</span>
                <span className="text-3xl sm:text-4xl animate-pulse delay-200">💔</span></>
                :
                fuelMode ? null : <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
              }
            </div>
            
            {/* Fuel mode display */}
            {fuelMode && (
              <>
                <h1 className={`text-xl sm:text-2xl font-bold mb-3 ${useSpaceBackground ? 'text-white' : 'text-gray-800'}`}>
                  {ui.TRY_AGAIN_NEED_MORE_FUEL}
                </h1>
                <div className="mb-3 flex items-center justify-center gap-2">
                  <Fuel className="h-5 w-5 text-red-500" />
                  <span className={`text-lg sm:text-xl font-bold ${useSpaceBackground ? 'text-white' : 'text-gray-800'}`}>
                    {fuelCollected} / {fuelRequired}
                  </span>
                  <Fuel className="h-5 w-5 text-blue-500" />
                </div>
                <div className={`mb-3 flex items-center justify-center gap-2 ${useSpaceBackground ? 'text-white/90' : 'text-gray-600'}`}>
                    <span className="text-xl">{ui.TRY_AGAIN_TOO_SLOW}</span>
                  </div>
              </>
            )}
            
            {/* "Game Over!" text - only in English, for all languages */}
            {livesLost && (
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 animate-fade-in">
                {ui.GAME_OVER}
              </h1>
            )}
            { !livesLost && !fuelMode && <>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {ui.TRY_AGAIN_GOOD_TRY}
            </h2>
            <p className="text-gray-600 mb-2 text-sm">
              {ui.TRY_AGAIN_SCORE_SUMMARY
                .replace("{correct}", String(totalCorrect))
                .replace("{total}", String(totalQuestions))
                .replace("{percent}", scorePercentage.toFixed(0))}
            </p>
            <p className="text-xs text-gray-500">
              {ui.TRY_AGAIN_NEED_PERCENT}
            </p>
            </>}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={onTryAgain}
              variant="game"
              size="lg"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base py-2.5 px-6"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              {ui.PLAY_AGAIN}
            </Button>
            
          </div>
        </div>
      </Card>
    </div>
  );

  if (useSpaceBackground) {
    return (
      <SpaceBackground className="h-full w-full" style={{ height: "100%", width: "100%", overflow: "hidden" }}>
        {content}
      </SpaceBackground>
    );
  }

  return content;
}
