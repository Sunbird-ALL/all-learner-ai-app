import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, Home, RotateCcw } from "lucide-react";
import { Language } from "../constants/languages";

interface TryAgainProps {
  totalCorrect: number;
  totalQuestions: number;
  selectedLanguage: Language;
  currentLevel: number;
  gameKey: string;
  onTryAgain: () => void;
  onBackToHome: () => void;
  livesLost?: boolean; // Flag to indicate if game ended due to lives lost
}

export function TryAgain({ 
  totalCorrect, 
  totalQuestions, 
  selectedLanguage, 
  currentLevel,
  gameKey,
  onTryAgain, 
  onBackToHome,
  livesLost = false
}: TryAgainProps) {
  const [isVisible, setIsVisible] = useState(false);
  const scorePercentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Add delay before showing the component for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // 200ms delay before showing
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-cool flex items-center justify-center p-2 sm:p-4 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className={`max-w-md w-full bg-white/95 backdrop-blur-sm shadow-2xl transition-all duration-700 ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        <div className="p-4 sm:p-8 text-center">
        <Button
              variant="secondary"
              onClick={() => {
                // Store the failed level in localStorage before going back to home
                const failedLevelKey = `failedLevel_${gameKey}`;
                localStorage.setItem(failedLevelKey, currentLevel.toString());
                onBackToHome();
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white border-0 text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-1 sm:gap-2"
              >
            <Home className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="hidden sm:inline">Learning Hub</span>
            <span className="sm:hidden">Hub</span>
            </Button>
          <div className="mt-6 mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              {livesLost ?
                <><span className="text-4xl sm:text-5xl md:text-6xl animate-pulse">💔</span>
                <span className="text-4xl sm:text-5xl md:text-6xl animate-pulse delay-100">💔</span>
                <span className="text-4xl sm:text-5xl md:text-6xl animate-pulse delay-200">💔</span></>
                :
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
              }
            </div>
            {/* "Oh No!" text - only in English, for all languages */}
            {livesLost && (
              <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-800 mb-2 animate-fade-in">
                Game Over!
              </h1>
            )}
            { !livesLost && <>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {selectedLanguage === 'te' ? 'మంచి ప్రయత్నం! 💪' :
               selectedLanguage === 'mr' ? 'चांगला प्रयत्न! 💪' :
               selectedLanguage === 'kn' ? 'ಒಳ್ಳೆಯ ಪ್ರಯತ್ನ! 💪' :
               'Good Try! 💪'}
            </h2>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              {selectedLanguage === 'te' ? 
                `మీరు ${totalCorrect} / ${totalQuestions} ప్రశ్నలకు సరైన సమాధానాలు ఇచ్చారు (${scorePercentage.toFixed(0)}%)` :
               selectedLanguage === 'mr' ? 
                `तुम्ही ${totalCorrect} / ${totalQuestions} प्रश्नांना योग्य उत्तरे दिली (${scorePercentage.toFixed(0)}%)` :
               selectedLanguage === 'kn' ? 
                `ನೀವು ${totalCorrect} / ${totalQuestions} ಪ್ರಶ್ನೆಗಳಿಗೆ ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿದ್ದೀರಿ (${scorePercentage.toFixed(0)}%)` :
               `You got ${totalCorrect} / ${totalQuestions} questions correct (${scorePercentage.toFixed(0)}%)`
              }
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {selectedLanguage === 'te' ? 
                'మీరు తదుపరి స్థాయికి వెళ్లడానికి కనీసం 80% స్కోర్ అవసరం' :
               selectedLanguage === 'mr' ? 
                'पुढील स्तरावर जाण्यासाठी किमान 80% स्कोअर आवश्यक आहे' :
               selectedLanguage === 'kn' ? 
                'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗಲು ನಿಮಗೆ ಕನಿಷ್ಠ 80% ಅಗತ್ಯವಿದೆ' :
               'You need at least 80% to advance to the next level'
              }
            </p>
            </>}
          </div>
          
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              onClick={onTryAgain}
              // className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold"
              variant="game"
              size="lg"
              className="flex items-center gap-2"
            >
                <RotateCcw className="h-5 w-5" />
                Play Again
            </Button>
            
          </div>
        </div>
      </Card>
    </div>
  );
}
