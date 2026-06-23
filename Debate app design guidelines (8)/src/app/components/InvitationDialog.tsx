import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSocial } from "../contexts/SocialContext";
import { useAuth } from "../contexts/AuthContext";
import { Swords } from "lucide-react";

interface InvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvitationDialog({ open, onOpenChange }: InvitationDialogProps) {
  const { user } = useAuth();
  const { sendInvitation } = useSocial();
  const [targetUser, setTargetUser] = useState("");
  const [topic, setTopic] = useState("");
  const [side, setSide] = useState<"user1" | "user2">("user2");

  const handleSend = () => {
    if (!targetUser.trim() || !topic.trim()) return;

    sendInvitation(targetUser.trim(), topic.trim(), side);
    setTargetUser("");
    setTopic("");
    setSide("user2");
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card rounded-[20px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center">
              <Swords className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-[20px] font-semibold">
                討論の招待
              </DialogTitle>
              <DialogDescription className="text-[14px] text-muted-foreground mt-1">
                対戦相手を招待して討論を始めましょう
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-[15px]">
              討論テーマ
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例: AIは人類にとって脅威か？"
              className="h-11 rounded-[12px] text-[15px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opponent" className="text-[15px]">
              招待する相手のユーザー名
            </Label>
            <Input
              id="opponent"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="ユーザー名を入力"
              className="h-11 rounded-[12px] text-[15px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[15px]">相手の立場</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setSide("user1")}
                className={`flex-1 py-3 px-4 rounded-[12px] text-[15px] font-medium transition-all duration-300 ${
                  side === "user1"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/30 text-foreground hover:bg-secondary/50"
                }`}
              >
                賛成側
              </button>
              <button
                onClick={() => setSide("user2")}
                className={`flex-1 py-3 px-4 rounded-[12px] text-[15px] font-medium transition-all duration-300 ${
                  side === "user2"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/30 text-foreground hover:bg-secondary/50"
                }`}
              >
                反対側
              </button>
            </div>
            <p className="text-[13px] text-muted-foreground">
              あなたは {side === "user1" ? "反対" : "賛成"} 側として参加します
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-[12px] text-[15px]"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSend}
              disabled={!targetUser.trim() || !topic.trim()}
              className="flex-1 h-11 rounded-[12px] text-[15px] font-semibold"
            >
              招待を送る
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
