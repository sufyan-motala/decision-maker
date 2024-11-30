"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon, CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDecision } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function CreateDecision() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalDeadline = deadline;
    if (deadline && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      finalDeadline = new Date(deadline);
      finalDeadline.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }

    const newDecision = addDecision({
      topic,
      description,
      options: options.filter((o) => o.trim() !== ""),
      dueDate: finalDeadline?.toISOString() || new Date().toISOString(),
      participants: [],
    });

    // Reset form
    setTopic("");
    setOptions(["", ""]);
    setDescription("");
    setDeadline(undefined);
    setSelectedTime(undefined);

    // Redirect to the new decision
    router.push(`/decision/${newDecision.id}`);
  };

  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Link href="/" className="block mb-4">
        <Button variant="outline">&larr; Back to Main Page</Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">Create Decision</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="topic">Decision Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the decision topic"
            required
          />
        </div>
        <div>
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mt-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {index > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  className="ml-2"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="mt-2"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Provide more context about the decision"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label>Deadline</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? (
                    format(deadline, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time">
                  {selectedTime ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedTime}
                    </div>
                  ) : (
                    <span>Select time</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {times.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Create Decision
        </Button>
      </form>
    </div>
  );
}
