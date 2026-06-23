import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Debate {
  id: string;
  title: string;
  user1: string;
  user2: string;
  isLive: boolean;
  viewers: number;
  votes: number;
  createdAt: number;
  isUserCreated?: boolean;
  user1Votes?: number;
  user2Votes?: number;
  category?: string;
  duration?: number; // Duration in minutes
  startedAt?: number; // When the debate started
  endedAt?: number; // When the debate ended
  winner?: "user1" | "user2" | "draw"; // Winner of the debate
  openToJoin?: boolean; // Open for others to join
  creator?: string; // Who created the debate
  creatorSide?: "user1" | "user2"; // Which side the creator is on
}

export interface DebateMessage {
  id: string;
  debateId: string;
  author: string;
  content: string;
  side: "user1" | "user2";
  createdAt: number;
  imageUrl?: string; // Optional image attachment
}

export interface Comment {
  id: string;
  debateId: string;
  messageId: string;
  author: string;
  content: string;
  createdAt: number;
  parentCommentId?: string; // For replies to comments
}

export interface MessageReaction {
  debateId: string;
  messageId: string;
  type: "like" | "dislike";
}

export interface Report {
  id: string;
  debateId: string;
  messageId?: string;
  commentId?: string;
  reportedBy: string;
  reason: string;
  createdAt: number;
  status: "pending" | "reviewed" | "dismissed";
}

interface UserVote {
  debateId: string;
  side: "user1" | "user2";
}

interface DebateContextType {
  userDebates: Debate[];
  allDebates: Debate[];
  addDebate: (debate: Omit<Debate, "id" | "createdAt" | "isUserCreated">) => string;
  deleteDebate: (id: string) => void;
  getDebate: (id: string) => Debate | undefined;
  vote: (debateId: string, side: "user1" | "user2") => void;
  getUserVote: (debateId: string) => "user1" | "user2" | null;
  updateDebate: (id: string, updates: Partial<Debate>) => void;
  endDebate: (debateId: string) => void;
  joinDebate: (debateId: string) => boolean;
  canCreateDebate: () => { allowed: boolean; waitTime?: number };
  messages: DebateMessage[];
  getMessages: (debateId: string) => DebateMessage[];
  addMessage: (debateId: string, content: string, side: "user1" | "user2", author: string, imageUrl?: string | null) => void;
  deleteMessage: (messageId: string) => void;
  comments: Comment[];
  getComments: (debateId: string, messageId: string) => Comment[];
  addComment: (debateId: string, messageId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  reactions: MessageReaction[];
  getReactionCounts: (debateId: string, messageId: string) => { likes: number; dislikes: number };
  getUserReaction: (debateId: string, messageId: string) => "like" | "dislike" | null;
  toggleReaction: (debateId: string, messageId: string, type: "like" | "dislike") => void;
  reports: Report[];
  addReport: (debateId: string, messageId: string | undefined, commentId: string | undefined, reason: string) => void;
  getReports: () => Report[];
  updateReportStatus: (reportId: string, status: "reviewed" | "dismissed") => void;
  currentUser: string;
}

// Empty initial data - users start fresh
const mockDebates: Debate[] = [];
const mockMessages: DebateMessage[] = [];

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export function DebateProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const user = auth?.user;
  const [userDebates, setUserDebates] = useState<Debate[]>([]);
  const [systemDebates, setSystemDebates] = useState<Debate[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const currentUser = user?.name || "ゲストユーザー";

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userDebates");
      if (stored) {
        setUserDebates(JSON.parse(stored));
      }

      const storedVotes = localStorage.getItem("userVotes");
      if (storedVotes) {
        setUserVotes(JSON.parse(storedVotes));
      }

      const storedSystem = localStorage.getItem("systemDebates");
      if (storedSystem) {
        setSystemDebates(JSON.parse(storedSystem));
      } else {
        // Initialize with mock data
        setSystemDebates(mockDebates);
      }

      const storedMessages = localStorage.getItem("debateMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages(mockMessages);
      }

      const storedComments = localStorage.getItem("comments");
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }

      const storedReactions = localStorage.getItem("reactions");
      if (storedReactions) {
        setReactions(JSON.parse(storedReactions));
      }

      const storedReports = localStorage.getItem("reports");
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    } catch (e) {
      console.error("Failed to load data", e);
      // Fallback to mock data
      setSystemDebates(mockDebates);
      setMessages(mockMessages);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever data changes (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("userDebates", JSON.stringify(userDebates));
    }
  }, [userDebates, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("userVotes", JSON.stringify(userVotes));
    }
  }, [userVotes, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("systemDebates", JSON.stringify(systemDebates));
    }
  }, [systemDebates, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("debateMessages", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("reactions", JSON.stringify(reactions));
    }
  }, [reactions, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("reports", JSON.stringify(reports));
    }
  }, [reports, isInitialized]);

  const allDebates = [...systemDebates, ...userDebates];

  const addDebate = (debate: Omit<Debate, "id" | "createdAt" | "isUserCreated">): string => {
    const newDebate: Debate = {
      ...debate,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
      isUserCreated: true,
      user1Votes: 0,
      user2Votes: 0,
    };
    setUserDebates((prev) => [newDebate, ...prev]);
    return newDebate.id;
  };

  const deleteDebate = (id: string) => {
    setUserDebates((prev) => prev.filter((d) => d.id !== id));
  };

  const getDebate = (id: string): Debate | undefined => {
    return allDebates.find((d) => d.id === id);
  };

  const vote = (debateId: string, side: "user1" | "user2") => {
    const existingVote = userVotes.find((v) => v.debateId === debateId);

    if (existingVote) {
      if (existingVote.side === side) {
        // Remove vote
        setUserVotes((prev) => prev.filter((v) => v.debateId !== debateId));
        updateDebateVotes(debateId, side, -1);
      } else {
        // Change vote
        setUserVotes((prev) =>
          prev.map((v) => (v.debateId === debateId ? { ...v, side } : v))
        );
        updateDebateVotes(debateId, existingVote.side, -1);
        updateDebateVotes(debateId, side, 1);
      }
    } else {
      // Add new vote
      setUserVotes((prev) => [...prev, { debateId, side }]);
      updateDebateVotes(debateId, side, 1);
    }
  };

  const updateDebateVotes = (debateId: string, side: "user1" | "user2", delta: number) => {
    const updateFn = (debates: Debate[]) =>
      debates.map((d) => {
        if (d.id === debateId) {
          const user1Votes = (d.user1Votes || 0) + (side === "user1" ? delta : 0);
          const user2Votes = (d.user2Votes || 0) + (side === "user2" ? delta : 0);
          return {
            ...d,
            user1Votes,
            user2Votes,
            votes: user1Votes + user2Votes,
          };
        }
        return d;
      });

    setSystemDebates(updateFn);
    setUserDebates(updateFn);
  };

  const getUserVote = (debateId: string): "user1" | "user2" | null => {
    const vote = userVotes.find((v) => v.debateId === debateId);
    return vote ? vote.side : null;
  };

  const updateDebate = (id: string, updates: Partial<Debate>) => {
    const updateFn = (debates: Debate[]) =>
      debates.map((d) => (d.id === id ? { ...d, ...updates } : d));

    setSystemDebates(updateFn);
    setUserDebates(updateFn);
  };

  const endDebate = (debateId: string) => {
    const debate = getDebate(debateId);
    if (debate) {
      const winner = debate.user1Votes! > debate.user2Votes! ? "user1" : debate.user1Votes! < debate.user2Votes! ? "user2" : "draw";
      updateDebate(debateId, { endedAt: Date.now(), winner });
    }
  };

  const joinDebate = (debateId: string): boolean => {
    const debate = getDebate(debateId);
    if (!debate || !debate.openToJoin || !debate.creator) {
      return false;
    }

    // Check if already joined
    if (debate.user1 === currentUser || debate.user2 === currentUser) {
      return false;
    }

    // Check if creator
    if (debate.creator === currentUser) {
      return false;
    }

    // Join as the opposite side
    if (debate.creatorSide === "user1") {
      updateDebate(debateId, {
        user2: currentUser,
        openToJoin: false,
        startedAt: Date.now(),
      });
    } else {
      updateDebate(debateId, {
        user1: currentUser,
        openToJoin: false,
        startedAt: Date.now(),
      });
    }

    return true;
  };

  const canCreateDebate = (): { allowed: boolean; waitTime?: number } => {
    const COOLDOWN_TIME = 30000; // 30 seconds cooldown

    // Get user's last debate creation time
    const userDebatesSorted = [...userDebates].sort((a, b) => b.createdAt - a.createdAt);
    const lastDebate = userDebatesSorted.find((d) => d.creator === currentUser);

    if (!lastDebate) {
      return { allowed: true };
    }

    const timeSinceLastDebate = Date.now() - lastDebate.createdAt;
    if (timeSinceLastDebate < COOLDOWN_TIME) {
      const waitTime = Math.ceil((COOLDOWN_TIME - timeSinceLastDebate) / 1000);
      return { allowed: false, waitTime };
    }

    return { allowed: true };
  };

  const getMessages = (debateId: string): DebateMessage[] => {
    return messages.filter((m) => m.debateId === debateId).sort((a, b) => a.createdAt - b.createdAt);
  };

  const addMessage = (debateId: string, content: string, side: "user1" | "user2", author: string, imageUrl?: string | null) => {
    const newMessage: DebateMessage = {
      id: `msg-${Date.now()}`,
      debateId,
      author,
      content,
      side,
      createdAt: Date.now(),
      imageUrl,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const getComments = (debateId: string, messageId: string): Comment[] => {
    return comments.filter((c) => c.debateId === debateId && c.messageId === messageId);
  };

  const addComment = (debateId: string, messageId: string, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      debateId,
      messageId,
      author: currentUser,
      content,
      createdAt: Date.now(),
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const getReactionCounts = (debateId: string, messageId: string) => {
    const likes = reactions.filter((r) => r.debateId === debateId && r.messageId === messageId && r.type === "like").length;
    const dislikes = reactions.filter((r) => r.debateId === debateId && r.messageId === messageId && r.type === "dislike").length;
    return { likes, dislikes };
  };

  const getUserReaction = (debateId: string, messageId: string) => {
    const reaction = reactions.find((r) => r.debateId === debateId && r.messageId === messageId);
    return reaction ? reaction.type : null;
  };

  const toggleReaction = (debateId: string, messageId: string, type: "like" | "dislike") => {
    const existingReaction = reactions.find((r) => r.debateId === debateId && r.messageId === messageId);

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction
        setReactions((prev) => prev.filter((r) => r.debateId !== debateId || r.messageId !== messageId));
      } else {
        // Change reaction
        setReactions((prev) =>
          prev.map((r) => (r.debateId === debateId && r.messageId === messageId ? { ...r, type } : r))
        );
      }
    } else {
      // Add new reaction
      setReactions((prev) => [...prev, { debateId, messageId, type }]);
    }
  };

  const addReport = (debateId: string, messageId: string | undefined, commentId: string | undefined, reason: string) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      debateId,
      messageId,
      commentId,
      reportedBy: currentUser,
      reason,
      createdAt: Date.now(),
      status: "pending",
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const getReports = () => {
    return reports;
  };

  const updateReportStatus = (reportId: string, status: "reviewed" | "dismissed") => {
    const updateFn = (reports: Report[]) =>
      reports.map((r) => (r.id === reportId ? { ...r, status } : r));

    setReports(updateFn);
  };

  return (
    <DebateContext.Provider
      value={{
        userDebates,
        allDebates,
        addDebate,
        deleteDebate,
        getDebate,
        vote,
        getUserVote,
        updateDebate,
        endDebate,
        joinDebate,
        canCreateDebate,
        messages,
        getMessages,
        addMessage,
        deleteMessage,
        comments,
        getComments,
        addComment,
        deleteComment,
        reactions,
        getReactionCounts,
        getUserReaction,
        toggleReaction,
        reports,
        addReport,
        getReports,
        updateReportStatus,
        currentUser,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
}

export function useDebates() {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error("useDebates must be used within a DebateProvider");
  }
  return context;
}