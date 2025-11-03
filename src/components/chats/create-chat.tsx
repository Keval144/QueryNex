// components/chats/create-chat.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn-ui/dialog";
import { Button } from "../shadcn-ui/button";
import { Label } from "../shadcn-ui/label";
import { Input } from "../shadcn-ui/input";
import { Switch } from "../shadcn-ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn-ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn-ui/tooltip";
import { InfoIcon } from "lucide-react";
import { CreateChatInput, createChatSchema } from "@/lib/validation";

interface CreateChatProps {
  trigger?: React.ReactNode;
}

function CreateChat({ trigger }: CreateChatProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateChatInput>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      title: "",
      database: "",
      dataString: "",
      safemode: true,
    },
  });

  const safemode = watch("safemode");
  const databaseType = watch("database");

  const onSubmit = async (data: CreateChatInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const result = await response.json();
      console.log("Chat created:", result);

      setOpen(false);
      reset();

      window.location.reload();
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
            <DialogDescription>
              Create a new chat session with your database configuration.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title Field */}
            <div className="grid gap-2">
              <Label htmlFor="title">Chat Title</Label>
              <Input
                id="title"
                placeholder="Enter chat title..."
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Database Field - Now a Select */}
            <div className="grid gap-2">
              <Label htmlFor="database">Database Type</Label>
              <Select
                value={databaseType}
                onValueChange={(value) => setValue("database", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
              {errors.database && (
                <p className="text-sm text-red-500">
                  {errors.database.message}
                </p>
              )}
            </div>

            {/* Data String Field */}
            <div className="grid gap-2">
              <Label htmlFor="dataString">Connection String</Label>
              <Input
                id="dataString"
                placeholder={`Enter ${databaseType} connection string...`}
                {...register("dataString")}
              />
              {errors.dataString && (
                <p className="text-sm text-red-500">
                  {errors.dataString.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="safemode" className="text-base">
                  Safe Mode
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p>
                        Only uses SELECT queries, prevents UPDATE/DELETE
                        operations,Only disable when you know what are you doing
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="safemode"
                checked={safemode}
                onCheckedChange={(checked) => setValue("safemode", checked)}
              />
            </div>
            <p className="text-muted-foreground -mt-2 text-sm">
              Prevents UPDATE, DELETE, and other potentially harmful queries
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChat;
