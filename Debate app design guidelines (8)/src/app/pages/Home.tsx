import { Link, useNavigate } from "react-router";
import { Plus, TrendingUp, UserPlus } from "lucide-react";
import { useDebates } from "../contexts/DebateContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Home() {
  const { userDebates, allDebates, joinDebate } = useDebates();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get different types of debates
  const openDebates = allDebates.filter((d) => d.openToJoin === true);
  const liveDebates = allDebates.filter((d) => d.isLive && !d.openToJoin).slice(0, 4);
  const popularDebates = allDebates
    .filter((d) => !d.isUserCreated)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  const handleJoinDebate = (debateId: string) => {
    if (!user) {
      toast.error("参加するにはサインインしてください");
      navigate("/signin");
      return;
    }

    const success = joinDebate(debateId);
    if (success) {
      toast.success("討論に参加しました！");
      navigate(`/debate/${debateId}`);
    } else {
      toast.error("参加できませんでした");
    }
  };
  
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="px-5 pt-8 pb-8">
        <div className="max-w-4xl">
          <h1 className="text-[32px] font-semibold mb-2" style={{ fontFamily: "var(--font-family-display)" }}>
            Open Debate
          </h1>
          <p className="text-muted-foreground text-[17px]">
            異なる視点を持つユーザーが、さまざまなテーマについて討論します
          </p>
        </div>
      </div>

      {/* Open to Join Section */}
      {openDebates.length > 0 && (
        <section className="mt-8">
          <div className="px-5 mb-4 flex items-center justify-between">
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
              参加募集中
            </h2>
            <UserPlus className="w-5 h-5 text-primary" />
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-5 pb-4">
              {openDebates.map((debate) => (
                <div
                  key={debate.id}
                  className="flex-shrink-0 w-[320px] bg-card rounded-[16px] p-5 border-2 border-primary/20"
                  style={{
                    height: "180px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="mb-2 inline-block bg-primary/10 text-primary px-2 py-1 rounded-[6px] text-[11px] font-semibold">
                        {debate.category || "一般"}
                      </div>
                      <h3 className="text-[16px] font-semibold mb-2 line-clamp-2" style={{ fontFamily: "var(--font-family-display)" }}>
                        {debate.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground">
                        作成者: {debate.creator}
                      </p>
                    </div>

                    <button
                      onClick={() => handleJoinDebate(debate.id)}
                      disabled={!user || debate.creator === user?.name}
                      className="w-full bg-primary text-primary-foreground py-2.5 rounded-[10px] text-[14px] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {!user ? "サインインして参加" : debate.creator === user?.name ? "自分の討論" : "参加する"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Today's Debates Section */}
      <section className="mt-8">
        <div className="px-5 mb-4 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
            Today's Debates
          </h2>
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {liveDebates.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-5 pb-4">
              {liveDebates.map((debate) => (
                <Link
                  key={debate.id}
                  to={`/debate/${debate.id}`}
                  className="flex-shrink-0 w-[320px] bg-card rounded-[16px] p-5 hover:scale-[1.02] transition-all duration-300"
                  style={{ 
                    height: "160px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-[18px] font-semibold mb-2 line-clamp-2" style={{ fontFamily: "var(--font-family-display)" }}>
                        {debate.title}
                      </h3>
                      <p className="text-[14px] text-muted-foreground">
                        {debate.user1} vs {debate.user2}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {debate.isLive && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-[13px] text-red-500 font-medium">Live</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 ml-auto text-[14px] text-muted-foreground">
                        {debate.isLive && <span>👁 {debate.viewers}</span>}
                        <span>🗳 {debate.votes}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-5">
            <div className="bg-card rounded-[16px] p-12 text-center" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
              <p className="text-[16px] text-muted-foreground mb-2">まだライブ討論がありません</p>
              <p className="text-[14px] text-muted-foreground">新しい討論を作成して、最初の討論を始めましょう！</p>
            </div>
          </div>
        )}
      </section>

      {/* Create Debate Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Link
          to="/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-[12px] shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">新しい討論を作成</span>
        </Link>
      </div>

      {/* Popular Topics Section */}
      {popularDebates.length > 0 && (
        <section className="mt-12 px-5">
          <h2 className="text-[22px] font-semibold mb-6" style={{ fontFamily: "var(--font-family-display)" }}>
            人気のテーマ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularDebates.map((debate) => (
              <Link
                key={debate.id}
                to={`/debate/${debate.id}`}
                className="bg-card rounded-[16px] p-5 hover:bg-secondary/20 transition-colors duration-300"
                style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
              >
                <h3 className="text-[16px] font-semibold mb-2">{debate.title}</h3>
                <p className="text-[14px] text-muted-foreground mb-3">
                  {debate.user1} vs {debate.user2}
                </p>
                <div className="text-[13px] text-muted-foreground">
                  {debate.votes} votes
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* My Debates Section */}
      <section className="mt-12 px-5">
        <h2 className="text-[22px] font-semibold mb-6" style={{ fontFamily: "var(--font-family-display)" }}>
          自分の投稿
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userDebates.length > 0 ? (
            userDebates.map((debate) => (
              <Link
                key={debate.id}
                to={`/debate/${debate.id}`}
                className="bg-card rounded-[16px] p-5 hover:bg-secondary/20 transition-colors duration-300"
                style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[16px] font-semibold flex-1">{debate.title}</h3>
                  {debate.isLive && (
                    <div className="flex items-center gap-1 ml-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[12px] text-red-500 font-medium">Live</span>
                    </div>
                  )}
                </div>
                <p className="text-[14px] text-muted-foreground mb-3">
                  {debate.user1} vs {debate.user2}
                </p>
                <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                  {debate.isLive && <span>👁 {debate.viewers}</span>}
                  <span>🗳 {debate.votes} votes</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p className="text-[16px]">まだ討論を作成していません</p>
              <p className="text-[14px] mt-2">新しい討論を作成してみましょう！</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}