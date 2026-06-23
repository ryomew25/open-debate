import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { User, Search, LogOut, Shield, Bell, Swords } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDebates } from "../contexts/DebateContext";
import { useSocial } from "../contexts/SocialContext";
import { NotificationPanel } from "./NotificationPanel";
import { InvitationDialog } from "./InvitationDialog";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getReports, allDebates } = useDebates();
  const { getUnreadCount } = useSocial();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    setProfileMenuOpen(false);
  };

  const handleSearchSelect = (debateId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/debate/${debateId}`);
  };

  // Simple admin check
  const isAdmin = user?.name === "運営";
  const pendingReportsCount = getReports().filter(r => r.status === "pending").length;
  const unreadCount = getUnreadCount();

  const filteredDebates = searchQuery
    ? allDebates.filter(
        (debate) =>
          debate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          debate.user1.toLowerCase().includes(searchQuery.toLowerCase()) ||
          debate.user2.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border" style={{ height: "88px" }}>
        <div className="h-full flex items-center justify-between px-5">
          <Link to="/" className="text-[28px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-family-display)" }}>
            Duel
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {user && (
              <>
                <button
                  onClick={() => setInvitationOpen(true)}
                  className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
                  title="討論の招待を送る"
                >
                  <Swords className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setNotificationOpen(true)}
                  className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                </button>
                
                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <div
                      className="absolute right-0 mt-2 w-56 bg-card rounded-[12px] shadow-lg z-50 overflow-hidden"
                      style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)" }}
                    >
                      <div className="p-4 border-b border-border">
                        <p className="text-[14px] font-semibold">{user?.name}</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">ユーザー</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-[15px]">マイページ</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="text-[15px]">管理画面</span>
                          {pendingReportsCount > 0 && (
                            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-[12px] rounded-full">
                              {pendingReportsCount}
                            </span>
                          )}
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left border-t border-border"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[15px]">サインアウト</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                to="/signin"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-[12px] text-[14px] font-medium hover:opacity-90 transition-opacity"
              >
                サインイン
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="max-w-2xl mx-auto mt-24 px-5" onClick={(e) => e.stopPropagation()}>
            <div className="bg-card rounded-[16px] overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}>
              {/* Search Input */}
              <div className="p-5 border-b border-border">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="討論を検索..."
                  className="w-full bg-transparent text-[18px] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {searchQuery && filteredDebates.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    検索結果が見つかりませんでした
                  </div>
                )}
                {searchQuery && filteredDebates.map((debate) => (
                  <button
                    key={debate.id}
                    onClick={() => handleSearchSelect(debate.id)}
                    className="w-full p-5 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors duration-300 text-left"
                  >
                    <h3 className="text-[16px] font-semibold mb-1">{debate.title}</h3>
                    <p className="text-[14px] text-muted-foreground">
                      {debate.user1} vs {debate.user2}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[13px] text-muted-foreground">
                      {debate.isLive && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-500">Live</span>
                        </div>
                      )}
                      <span>🗳 {debate.votes}</span>
                    </div>
                  </button>
                ))}
                {!searchQuery && (
                  <div className="p-8 text-center text-muted-foreground">
                    討論のタイトルやユーザー名で検索できます
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Panel */}
      <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* Invitation Dialog */}
      <InvitationDialog open={invitationOpen} onOpenChange={setInvitationOpen} />
    </>
  );
}