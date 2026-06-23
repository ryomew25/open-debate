import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function SignIn() {
  const { user, setUsername } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }

    if (name.trim().length < 2) {
      setError("名前は2文字以上で入力してください");
      return;
    }

    setUsername(name);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ホームに戻る
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-[16px] mb-4">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 
            className="text-[32px] font-semibold mb-2" 
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Duel
          </h1>
          <p className="text-[17px] text-muted-foreground">
            Open Debate Platform
          </p>
        </div>

        {/* Name Entry Card */}
        <div
          className="bg-card rounded-[16px] p-6 md:p-8"
          style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="mb-6">
            <h2 className="text-[20px] font-semibold mb-2">名前を入力</h2>
            <p className="text-[15px] text-muted-foreground">
              ニックネームを入力するだけで、すぐに参加できます
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[15px]">
                ニックネーム
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 山田太郎"
                className="h-12 rounded-[12px] text-[17px]"
                autoFocus
                required
                maxLength={20}
              />
              <p className="text-[13px] text-muted-foreground">
                2〜20文字で入力してください
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-[12px] px-4 py-3">
                <p className="text-[14px] text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-[12px] text-[17px] font-semibold"
            >
              参加する
            </Button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <p className="text-[13px] text-muted-foreground">
                ✓ メールアドレスやパスワードは不要です
              </p>
              <p className="text-[13px] text-muted-foreground">
                ✓ 個人情報は一切収集しません
              </p>
              <p className="text-[13px] text-muted-foreground">
                ✓ データはブラウザに保存され、次回も同じ名前で続けられます
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-[13px] text-muted-foreground">
            安全で簡単な参加方法で、今すぐディベートを始めましょう
          </p>
          <p className="text-[13px] text-muted-foreground">
            参加することで
            <Link to="/terms" className="text-primary underline underline-offset-2 mx-1">
              利用規約
            </Link>
            に同意したものとみなされます
          </p>
        </div>
      </div>
    </div>
  );
}