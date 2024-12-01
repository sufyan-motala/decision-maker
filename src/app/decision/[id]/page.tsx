"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Share, MessageSquare, Check, Copy } from "lucide-react";
import {
  getDecision,
  addParticipantVote,
  addDiscussionMessage,
  type Decision,
} from "@/lib/storage";
import { useParams } from "next/navigation";

export default function DecisionDetail() {
  const params = useParams();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [comment, setComment] = useState("");
  const [discussionComment, setDiscussionComment] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const foundDecision = getDecision(params.id as string);
    setDecision(foundDecision);
  }, [params.id]);

  if (!decision) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOption) return;

    const updatedDecision = addParticipantVote(
      params.id as string,
      selectedOption,
      comment
    );
    if (updatedDecision) {
      setDecision(updatedDecision);
    }

    setSelectedOption("");
    setComment("");
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this decision with others.",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy link",
          description: "Please try again or manually copy the URL.",
          variant: "destructive",
        });
      });
  };

  const handleDiscussionComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!discussionComment.trim()) return;

    const updatedDecision = addDiscussionMessage(params.id as string, {
      author: "Current User", // In production, use actual user name
      message: discussionComment,
    });

    if (updatedDecision) {
      setDecision(updatedDecision);
    }
    setDiscussionComment("");
  };

  const getVoteBreakdown = () => {
    const totalVotes = decision.participants.filter((p) => p.vote).length;
    return decision.options.map((option) => {
      const voteCount = decision.participants.filter(
        (p) => p.vote === option
      ).length;
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
      return { option, voteCount, percentage };
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <Link href="/active">
          <Button variant="outline">&larr; Back to Active Decisions</Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Decision</DialogTitle>
              <DialogDescription>
                Copy the link below to share this decision
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Input readOnly value={window.location.href} className="flex-1" />
              <Button onClick={handleShare} className="shrink-0">
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{decision.topic}</CardTitle>
          <CardDescription>Due: {decision.dueDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{decision.description}</p>

          {/* Vote Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {decision.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Textarea
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Submit Vote
            </Button>
          </form>

          {/* Vote Breakdown */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Vote Breakdown</h3>
            {getVoteBreakdown().map(({ option, voteCount, percentage }) => (
              <div key={option} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>{option}</span>
                  <span>
                    {voteCount} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </div>

          {/* Participants */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Participant Votes</h3>
            {decision.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-start space-x-2 mb-2"
              >
                <Avatar>
                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{participant.name}</p>
                  <p>{participant.vote || "Not voted yet"}</p>
                  <p className="text-sm text-gray-500">
                    {participant.comment || "No comment"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Discussion Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Discussion
            </h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {decision.discussion.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{msg.author[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{msg.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {msg.time}
                    </span>
                  </div>
                  <p className="ml-8 mt-1">{msg.message}</p>
                  <Separator className="my-2" />
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleDiscussionComment} className="mt-4">
              <Textarea
                placeholder="Add to the discussion..."
                value={discussionComment}
                onChange={(e) => setDiscussionComment(e.target.value)}
                className="mb-2"
              />
              <Button type="submit">Post Comment</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
