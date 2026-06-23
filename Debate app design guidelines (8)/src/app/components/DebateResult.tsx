import { Trophy, Medal } from "lucide-react";
import { Debate } from "../contexts/DebateContext";

interface DebateResultProps {
  debate: Debate;
}

export function DebateResult({ debate }: DebateResultProps) {
  if (!debate.endedAt || !debate.winner) {
    return null;
  }

  const user1Votes = debate.user1Votes || 0;
  const user2Votes = debate.user2Votes || 0;

  return (
    <div
      className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-[16px] p-8 text-center mb-6"
      style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)" }}
    >
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
        <Trophy className="w-10 h-10 text-white" />
      </div>
      
      <h2 
        className="text-[28px] font-bold mb-2" 
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        討論終了
      </h2>
      
      {debate.winner === "draw" ? (
        <p className="text-[18px] text-muted-foreground mb-6">
          引き分けです
        </p>
      ) : (
        <p className="text-[18px] text-muted-foreground mb-6">
          <span className="text-primary font-semibold">
            {debate.winner === "user1" ? debate.user1 : debate.user2}
          </span>{" "}
          の勝利！
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        <div 
          className={`bg-card rounded-[16px] p-6 border-2 transition-all duration-300 ${
            debate.winner === "user1" 
              ? "border-primary scale-105" 
              : "border-border"
          }`}
        >
          {debate.winner === "user1" && (
            <div className="mb-3">
              <Medal className="w-8 h-8 text-primary mx-auto" />
            </div>
          )}
          <div className="text-[13px] text-muted-foreground mb-1">
            {debate.user1}
          </div>
          <div className="text-[32px] font-bold text-primary">
            {user1Votes}
          </div>
          <div className="text-[12px] text-muted-foreground">票</div>
        </div>

        <div 
          className={`bg-card rounded-[16px] p-6 border-2 transition-all duration-300 ${
            debate.winner === "user2" 
              ? "border-primary scale-105" 
              : "border-border"
          }`}
        >
          {debate.winner === "user2" && (
            <div className="mb-3">
              <Medal className="w-8 h-8 text-primary mx-auto" />
            </div>
          )}
          <div className="text-[13px] text-muted-foreground mb-1">
            {debate.user2}
          </div>
          <div className="text-[32px] font-bold text-primary">
            {user2Votes}
          </div>
          <div className="text-[12px] text-muted-foreground">票</div>
        </div>
      </div>
    </div>
  );
}
