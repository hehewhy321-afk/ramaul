import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquarePlus, MessageCircle, Lock, Clock, User, Send, Search, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CATEGORIES = ['general', 'infrastructure', 'education', 'health', 'environment', 'culture', 'complaints', 'suggestions'];

const AVATAR_COLORS = [
  'bg-primary', 'bg-accent', 'bg-destructive', 'bg-blue-500', 'bg-purple-500',
  'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-indigo-500', 'bg-emerald-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  category: string;
  author_name: string;
  avatar_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ReplyData {
  id: string;
  discussion_id: string;
  author_name: string;
  avatar_url: string | null;
  content: string;
  created_at: string;
  parent_reply_id: string | null;
}

function buildReplyTree(replies: ReplyData[]): Map<string | null, ReplyData[]> {
  const tree = new Map<string | null, ReplyData[]>();
  replies.forEach(r => {
    const parentId = r.parent_reply_id ?? null;
    if (!tree.has(parentId)) tree.set(parentId, []);
    tree.get(parentId)!.push(r);
  });
  return tree;
}

function ReplyThread({
  replyTree,
  parentId,
  depth,
  discussionStatus,
  replyName,
  setReplyName,
  onReply,
  isPending,
}: {
  replyTree: Map<string | null, ReplyData[]>;
  parentId: string | null;
  depth: number;
  discussionStatus: string;
  replyName: string;
  setReplyName: (v: string) => void;
  onReply: (content: string, parentReplyId: string | null) => void;
  isPending: boolean;
}) {
  const replies = replyTree.get(parentId) || [];
  if (replies.length === 0) return null;

  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}>
      {replies.map(reply => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          replyTree={replyTree}
          depth={depth}
          discussionStatus={discussionStatus}
          replyName={replyName}
          setReplyName={setReplyName}
          onReply={onReply}
          isPending={isPending}
        />
      ))}
    </div>
  );
}

function ReplyItem({
  reply,
  replyTree,
  depth,
  discussionStatus,
  replyName,
  setReplyName,
  onReply,
  isPending,
}: {
  reply: ReplyData;
  replyTree: Map<string | null, ReplyData[]>;
  depth: number;
  discussionStatus: string;
  replyName: string;
  setReplyName: (v: string) => void;
  onReply: (content: string, parentReplyId: string | null) => void;
  isPending: boolean;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showChildren, setShowChildren] = useState(true);
  const children = replyTree.get(reply.id) || [];
  const canSubmit = replyContent.trim().length >= 2 && replyName.trim().length >= 2;

  const handleSubmitReply = () => {
    onReply(replyContent.trim(), reply.id);
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <div className="mb-3">
      <Card className="bg-muted/30">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback className={`${getAvatarColor(reply.author_name)} text-white text-xs font-bold`}>
                {reply.author_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{reply.author_name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(reply.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground/80">{reply.content}</p>
              <div className="flex items-center gap-2 mt-2">
                {discussionStatus === 'open' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <Reply className="h-3 w-3 mr-1" /> Reply
                  </Button>
                )}
                {children.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowChildren(!showChildren)}
                  >
                    {showChildren ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                    {children.length} {children.length === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-3 ml-10 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Your name"
                  value={replyName}
                  onChange={e => setReplyName(e.target.value)}
                  className="max-w-[180px] h-8 text-sm"
                  maxLength={50}
                />
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder={`Reply to ${reply.author_name}...`}
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  className="flex-1 min-h-[50px] text-sm"
                  maxLength={2000}
                />
                <Button
                  size="icon"
                  className="self-end h-8 w-8"
                  disabled={!canSubmit || isPending}
                  onClick={handleSubmitReply}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nested children */}
      {showChildren && children.length > 0 && (
        <ReplyThread
          replyTree={replyTree}
          parentId={reply.id}
          depth={depth + 1}
          discussionStatus={discussionStatus}
          replyName={replyName}
          setReplyName={setReplyName}
          onReply={onReply}
          isPending={isPending}
        />
      )}
    </div>
  );
}

const Discussions = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [authorName, setAuthorName] = useState('');

  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');

  useRealtimeSubscription('discussions', [['discussions']]);
  useRealtimeSubscription('discussion_replies', [['discussion_replies']]);

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ['discussions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Discussion[];
    },
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['discussion_replies', selectedDiscussion?.id],
    queryFn: async () => {
      if (!selectedDiscussion) return [];
      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('discussion_id', selectedDiscussion.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as ReplyData[];
    },
    enabled: !!selectedDiscussion,
  });

  const replyTree = buildReplyTree(replies);
  const topLevelReplies = replyTree.get(null) || [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('discussions').insert({
        title: title.trim(),
        description: description.trim(),
        category,
        author_name: authorName.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      toast.success('Discussion created!');
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setCategory('general');
      setAuthorName('');
    },
    onError: () => toast.error('Failed to create discussion'),
  });

  const replyMutation = useMutation({
    mutationFn: async ({ content, parentReplyId }: { content: string; parentReplyId: string | null }) => {
      if (!selectedDiscussion) return;
      const insertData: any = {
        discussion_id: selectedDiscussion.id,
        author_name: replyName.trim(),
        content,
      };
      if (parentReplyId) {
        insertData.parent_reply_id = parentReplyId;
      }
      const { error } = await supabase.from('discussion_replies').insert(insertData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion_replies', selectedDiscussion?.id] });
      toast.success('Reply posted!');
      setReplyContent('');
    },
    onError: () => toast.error('Failed to post reply'),
  });

  const closeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('discussions').update({ status: 'closed' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      if (selectedDiscussion) setSelectedDiscussion({ ...selectedDiscussion, status: 'closed' });
      toast.success('Discussion closed');
    },
  });

  const handleReply = (content: string, parentReplyId: string | null) => {
    replyMutation.mutate({ content, parentReplyId });
  };

  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = searchQuery.trim() === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openDiscussions = filteredDiscussions.filter(d => d.status === 'open');
  const closedDiscussions = filteredDiscussions.filter(d => d.status === 'closed');

  const replyCounts = useQuery({
    queryKey: ['discussion_reply_counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select('discussion_id');
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((r: { discussion_id: string }) => {
        counts[r.discussion_id] = (counts[r.discussion_id] || 0) + 1;
      });
      return counts;
    },
  });

  const canSubmitPost = title.trim().length >= 3 && description.trim().length >= 10 && authorName.trim().length >= 2;
  const canSubmitTopReply = replyContent.trim().length >= 2 && replyName.trim().length >= 2;

  if (selectedDiscussion) {
    return (
      <Layout>
        <SEOHead title="Discussions" description="Join community discussions and conversations in Ramaul Village." path="/discussions" />
        <div className="pt-24 pb-16 px-4">
          <div className="container-village max-w-3xl">
            <Button variant="ghost" onClick={() => setSelectedDiscussion(null)} className="mb-4">
              ← Back to Discussions
            </Button>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarFallback className={`${getAvatarColor(selectedDiscussion.author_name)} text-white font-bold`}>
                        {selectedDiscussion.author_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{selectedDiscussion.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{selectedDiscussion.author_name}</span>
                        <span>·</span>
                        <span>{format(new Date(selectedDiscussion.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedDiscussion.category === 'general' ? 'secondary' : 'outline'}>
                      {selectedDiscussion.category}
                    </Badge>
                    {selectedDiscussion.status === 'closed' && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">{selectedDiscussion.description}</p>
              </CardContent>
            </Card>

            {isAdmin && selectedDiscussion.status === 'open' && (
              <div className="mt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => closeMutation.mutate(selectedDiscussion.id)}>
                  <Lock className="h-4 w-4 mr-1" /> Close Discussion
                </Button>
              </div>
            )}

            {/* Replies */}
            <div className="mt-8">
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> Replies ({replies.length})
              </h3>

              {/* Threaded replies */}
              {topLevelReplies.length > 0 ? (
                <ReplyThread
                  replyTree={replyTree}
                  parentId={null}
                  depth={0}
                  discussionStatus={selectedDiscussion.status}
                  replyName={replyName}
                  setReplyName={setReplyName}
                  onReply={handleReply}
                  isPending={replyMutation.isPending}
                />
              ) : (
                <p className="text-center text-muted-foreground py-6">No replies yet. Be the first to respond!</p>
              )}

              {/* Top-level reply form */}
              {selectedDiscussion.status === 'open' ? (
                <Card className="mt-6">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Your name"
                        value={replyName}
                        onChange={e => setReplyName(e.target.value)}
                        className="max-w-[200px]"
                        maxLength={50}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        className="flex-1 min-h-[60px]"
                        maxLength={2000}
                      />
                      <Button
                        size="icon"
                        className="self-end"
                        disabled={!canSubmitTopReply || replyMutation.isPending}
                        onClick={() => handleReply(replyContent.trim(), null)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-6 bg-muted/50">
                  <CardContent className="p-4 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" /> This discussion is closed and no longer accepting replies.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Discussions" description="Join community discussions and conversations in Ramaul Village." path="/discussions" />
      <div className="pt-24 pb-16 px-4">
        <div className="container-village">
          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Community Discussions</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Share your thoughts, ideas, and concerns freely. No sign-up required — your privacy matters.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <MessageSquarePlus className="h-5 w-5" /> Start a Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Your Name / Username</label>
                    <Input
                      placeholder="e.g. Ram Kumar"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input
                      placeholder="Discussion topic"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      maxLength={200}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      placeholder="Describe your topic in detail (min 10 characters)"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="min-h-[120px]"
                      maxLength={5000}
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={!canSubmitPost || createMutation.isPending}
                    onClick={() => createMutation.mutate()}
                  >
                    {createMutation.isPending ? 'Posting...' : 'Post Discussion'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="open">
            <TabsList className="mb-6">
              <TabsTrigger value="open" className="gap-1">
                <MessageCircle className="h-4 w-4" /> Open ({openDiscussions.length})
              </TabsTrigger>
              <TabsTrigger value="closed" className="gap-1">
                <Lock className="h-4 w-4" /> Closed ({closedDiscussions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open">
              <DiscussionList
                discussions={openDiscussions}
                replyCounts={replyCounts.data || {}}
                onSelect={setSelectedDiscussion}
                isLoading={isLoading}
                emptyMessage="No open discussions yet. Start one!"
              />
            </TabsContent>
            <TabsContent value="closed">
              <DiscussionList
                discussions={closedDiscussions}
                replyCounts={replyCounts.data || {}}
                onSelect={setSelectedDiscussion}
                isLoading={isLoading}
                emptyMessage="No closed discussions."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

function DiscussionList({
  discussions,
  replyCounts,
  onSelect,
  isLoading,
  emptyMessage,
}: {
  discussions: Discussion[];
  replyCounts: Record<string, number>;
  onSelect: (d: Discussion) => void;
  isLoading: boolean;
  emptyMessage: string;
}) {
  if (isLoading) {
    return <p className="text-center text-muted-foreground py-10">Loading...</p>;
  }
  if (discussions.length === 0) {
    return <p className="text-center text-muted-foreground py-10">{emptyMessage}</p>;
  }
  return (
    <div className="space-y-3">
      {discussions.map(d => (
        <Card
          key={d.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect(d)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarFallback className={`${getAvatarColor(d.author_name)} text-white font-bold`}>
                {d.author_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-semibold text-base truncate">{d.title}</h3>
                <Badge variant="outline" className="text-xs capitalize">{d.category}</Badge>
                {d.status === 'closed' && (
                  <Badge variant="destructive" className="text-xs flex items-center gap-0.5">
                    <Lock className="h-2.5 w-2.5" /> Closed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{d.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{d.author_name}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(d.created_at), 'MMM d, yyyy')}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{replyCounts[d.id] || 0} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Discussions;
