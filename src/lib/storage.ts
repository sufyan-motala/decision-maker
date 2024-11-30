export interface Participant {
  id: number;
  name: string;
  vote: string | null;
  comment: string | null;
}

export interface Message {
  id: number;
  author: string;
  message: string;
  time: string;
}

export interface Decision {
  id: string;
  topic: string;
  description: string;
  options: string[];
  dueDate: string;
  participants: Participant[];
  discussion: Message[];
  status: "active" | "finalized";
}

const STORAGE_KEY = "decisions";

// Initial mock data
const initialDecisions: Decision[] = [
  {
    id: "0",
    topic: "Team Lunch Venue",
    description: "Choose a venue for the team lunch.",
    options: ["Pizza Place", "Sushi Bar", "Salad Spot"],
    dueDate: "2023-11-15",
    status: "finalized",
    participants: [
      { id: 1, name: "Alice", vote: "Pizza Place", comment: null },
      { id: 2, name: "Bob", vote: "Pizza Place", comment: null },
      { id: 3, name: "Charlie", vote: "Pizza Place", comment: null },
      { id: 4, name: "Diana", vote: "Pizza Place", comment: null },
      { id: 5, name: "Eve", vote: "Pizza Place", comment: null },
      { id: 6, name: "Frank", vote: "Pizza Place", comment: null },
      { id: 7, name: "Grace", vote: "Sushi Bar", comment: null },
      { id: 8, name: "Henry", vote: "Sushi Bar", comment: null },
      { id: 9, name: "Ivy", vote: "Sushi Bar", comment: null },
      { id: 10, name: "Jack", vote: "Salad Spot", comment: null },
    ],
    discussion: [],
  },
  {
    id: "1",
    topic: "New Project Name",
    description: "Choose a name for the new project.",
    options: ["Project Phoenix", "Operation Sunrise", "Initiative Alpha"],
    dueDate: "2023-11-10",
    status: "finalized",
    participants: [
      { id: 1, name: "Alice", vote: "Project Phoenix", comment: null },
      { id: 2, name: "Bob", vote: "Project Phoenix", comment: null },
      { id: 3, name: "Charlie", vote: "Project Phoenix", comment: null },
      { id: 4, name: "Diana", vote: "Project Phoenix", comment: null },
      { id: 5, name: "Eve", vote: "Operation Sunrise", comment: null },
      { id: 6, name: "Frank", vote: "Operation Sunrise", comment: null },
      { id: 7, name: "Grace", vote: "Initiative Alpha", comment: null },
    ],
    discussion: [],
  },
  {
    id: "2",
    topic: "Weekend Trip Destination",
    description:
      "We need to decide where to go for our team-building weekend trip.",
    options: ["Beach Resort", "Mountain Retreat", "City Exploration"],
    dueDate: "2023-12-01",
    status: "active",
    participants: [
      {
        id: 1,
        name: "Alice",
        vote: "Beach Resort",
        comment: "I love the beach!",
      },
      {
        id: 2,
        name: "Bob",
        vote: "Mountain Retreat",
        comment: "Mountains are more relaxing.",
      },
      {
        id: 3,
        name: "Charlie",
        vote: "City Exploration",
        comment: "Let's explore a new city!",
      },
      {
        id: 4,
        name: "Diana",
        vote: "Beach Resort",
        comment: "Beach is perfect for team activities.",
      },
    ],
    discussion: [
      {
        id: 1,
        author: "Alice",
        message: "Has anyone checked the weather forecast?",
        time: "2 hours ago",
      },
      {
        id: 2,
        author: "Bob",
        message: "Mountain weather looks perfect next weekend!",
        time: "1 hour ago",
      },
      {
        id: 3,
        author: "Charlie",
        message: "We should consider transportation costs too.",
        time: "30 minutes ago",
      },
    ],
  },
  {
    id: "3",
    topic: "Project Team Name",
    description: "We need to choose a name for our new project team.",
    options: ["Team Alpha", "The Innovators", "Project X"],
    dueDate: "2023-11-30",
    status: "active",
    participants: [
      {
        id: 1,
        name: "Frank",
        vote: "Team Alpha",
        comment: "Sounds professional.",
      },
      {
        id: 2,
        name: "Grace",
        vote: "The Innovators",
        comment: "Reflects our creative spirit.",
      },
      {
        id: 3,
        name: "Henry",
        vote: "Project X",
        comment: "Mysterious and cool!",
      },
      {
        id: 4,
        name: "Ivy",
        vote: "Team Alpha",
        comment: "Simple and effective.",
      },
      {
        id: 5,
        name: "Jack",
        vote: "The Innovators",
        comment: "Emphasizes our innovative approach.",
      },
    ],
    discussion: [],
  },
];

// Initialize storage with mock data if empty
const initializeStorage = () => {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDecisions));
  }
};

// Get all decisions
export const getDecisions = (): Decision[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get a single decision by ID
export const getDecision = (id: string): Decision | null => {
  const decisions = getDecisions();
  return decisions.find((d) => d.id === id) || null;
};

// Add a new decision
export const addDecision = (
  decision: Omit<Decision, "id" | "status">
): Decision => {
  const decisions = getDecisions();
  const newDecision = {
    ...decision,
    id: Math.random().toString(36).substr(2, 9),
    status: "active" as const,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...decisions, newDecision])
  );
  return newDecision;
};

// Update a decision
export const updateDecision = (
  id: string,
  updates: Partial<Decision>
): Decision | null => {
  const decisions = getDecisions();
  const index = decisions.findIndex((d) => d.id === id);

  if (index === -1) return null;

  const updatedDecision = { ...decisions[index], ...updates };
  decisions[index] = updatedDecision;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  return updatedDecision;
};

// Add new method to add a message to the discussion
export const addDiscussionMessage = (
  decisionId: string,
  message: Omit<Message, "id" | "time">
): Decision | null => {
  const decisions = getDecisions();
  const decision = decisions.find((d) => d.id === decisionId);

  if (!decision) return null;

  const newMessage: Message = {
    ...message,
    id: Math.random(), // In production, use a better ID generation method
    time: new Date().toLocaleTimeString(),
  };

  const updatedDecision = {
    ...decision,
    discussion: [...decision.discussion, newMessage],
  };

  return updateDecision(decisionId, updatedDecision);
};

// Add new method to add a participant vote
export const addParticipantVote = (
  decisionId: string,
  vote: string,
  comment: string | null
): Decision | null => {
  const decisions = getDecisions();
  const decision = decisions.find((d) => d.id === decisionId);

  if (!decision) return null;

  const newParticipant: Participant = {
    id: Math.random(), // In production, use a better ID generation method
    name: `User ${decision.participants.length + 1}`, // Mock user name
    vote,
    comment,
  };

  const updatedDecision = {
    ...decision,
    participants: [...decision.participants, newParticipant],
  };

  return updateDecision(decisionId, updatedDecision);
};
