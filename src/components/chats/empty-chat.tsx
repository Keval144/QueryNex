import { IconFolderCode } from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../shadcn-ui/empty";
import { Button } from "../shadcn-ui/button";
import { ArrowUpRightIcon } from "lucide-react";

function EmptyChat() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Chats Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any chats yet. Get started by creating your
          first chat.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create Project</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}

export default EmptyChat;
