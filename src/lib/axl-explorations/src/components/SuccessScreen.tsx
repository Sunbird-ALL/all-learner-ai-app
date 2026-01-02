import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Crown, 
  Medal, 
  Gift,
  ArrowRight,
  RotateCcw,
  Home
} from "lucide-react";
import { cn } from "../lib/utils";

interface SuccessScreenProps {
  gameTitle: string;
  score: number;
  totalQuestions: number;
  totalAttempts?: number;
  starsEarned: number;
  newAchievements?: string[];
  onPlayAgain: () => void;
  onBackToHub: () => void;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
}

export function SuccessScreen({
  gameTitle,
  score,
  totalQuestions,
  totalAttempts,
  starsEarned,
  newAchievements = [],
  onPlayAgain,
  onBackToHub,
  onNextLevel,
  hasNextLevel = false
}: SuccessScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const attemptsUsed = Math.max(totalAttempts ?? totalQuestions, 1);
  const perfectScore = score === attemptsUsed;
  const percentage = Math.round((score / attemptsUsed) * 100);

  // Animation sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(1), 500),
      setTimeout(() => setCurrentStep(2), 1200),
      setTimeout(() => setCurrentStep(3), 2000),
      setTimeout(() => setShowConfetti(false), 8000)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const confettiElements = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    emoji: ['🎉', '⭐', '🌟', '✨', '🎊', '🏆', '👏'][Math.floor(Math.random() * 7)],
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    left: Math.random() * 100,
  }));

  return (
    <div className="min-h-screen bg-gradient-sky relative overflow-hidden flex items-center justify-center p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiElements.map((confetti) => (
            <div
              key={confetti.id}
              className="absolute text-2xl animate-bounce-in opacity-90"
              style={{
                left: `${confetti.left}%`,
                animationDelay: `${confetti.delay}s`,
                animationDuration: `${confetti.duration}s`,
                top: '-10%',
                transform: `translateY(120vh) rotate(${Math.random() * 360}deg)`
              }}
            >
              {confetti.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-60">☁️</div>
        <div className="absolute top-32 right-20 text-5xl animate-bounce-soft opacity-70">🌈</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-sparkle opacity-80">⭐</div>
        <div className="absolute bottom-40 right-10 text-5xl animate-float opacity-60">✨</div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto min-w-[300px] w-full">
        {/* Main Success Card */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-magical border-2 border-success/30 text-center">
          {/* Trophy and Title */}
          <Button
            onClick={onBackToHub}
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white border-0 text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-1 sm:gap-2"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="hidden sm:inline">Learning Hub</span>
            <span className="sm:hidden">Hub</span>
          </Button>
          <div className={cn(
            "transition-all duration-1000 transform",
            currentStep >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow shadow-success">
                {perfectScore ? (
                  <Crown className="h-12 w-12 text-white animate-wiggle" />
                ) : (
                  <Trophy className="h-12 w-12 text-white animate-celebration" />
                )}
              </div>
              
              {/* Floating stars around trophy */}
              <div className="absolute -top-2 -left-2 text-warning animate-sparkle">⭐</div>
              <div className="absolute -top-2 -right-2 text-warning animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute -bottom-2 -left-2 text-warning animate-sparkle" style={{ animationDelay: '1s' }}>🌟</div>
              <div className="absolute -bottom-2 -right-2 text-warning animate-sparkle" style={{ animationDelay: '1.5s' }}>⭐</div>
            </div>

            <div className="mt-4 mb-2 text-lg font-medium text-foreground">
                {percentage === 100 && "Amazing! You got everything right!"}
                {percentage >= 90 && percentage < 100 && "🎯 Excellent work! You're almost perfect!"}
                {percentage >= 80 && percentage < 90 && "👏 Great job! You're learning so well!"}
                {percentage >= 70 && percentage < 80 && "💪 Good effort! Keep practicing!"}
                {percentage < 70 && "🌱 Nice try! Every attempt makes you stronger!"}
              </div>
            {/* Removed game title completion line as requested */}
          </div>

          {/* Stars Display */}
          <div className={cn(
            "transition-all duration-1000 transform delay-1000",
            currentStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="mb-6">
              {/* <h3 className="text-xl font-bold text-foreground mb-4">Stars Earned!</h3> */}
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-8 w-8",
                      i < starsEarned
                        ? "text-warning fill-warning"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className={cn(
            "transition-all duration-1000 transform delay-2000",
            currentStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasNextLevel && (
                <Button
                  onClick={onNextLevel}
                  variant="success"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  Next Level
                </Button>
              )}
              
              {!hasNextLevel && (
                <Button
                onClick={onPlayAgain}
                variant="game"
                size="lg"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Play Again
              </Button>
              )}
            </div>
          </div>

          {/* Fun mascot message */}
          <div className={cn(
            "transition-all duration-1000 transform delay-2500",
            currentStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="mt-6 bg-gradient-to-br from-blue-game/20 to-purple-game/20 rounded-full p-4 inline-block">
              <div className="text-4xl animate-wiggle">🦉</div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground italic">
              "I'm so proud of you! Keep up the amazing work!" 
            </div>
          </div>
        </Card>

        {/* Removed perfect score bonus banner */}
      </div>
    </div>
  );
}