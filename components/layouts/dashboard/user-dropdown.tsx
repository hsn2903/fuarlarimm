"use client";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon, SettingsIcon } from "lucide-react";

const UserDropdown = () => {
  const { data: session, isPending } = authClient.useSession();

  // If session is pending, show loading state
  if (isPending) {
    return (
      <Avatar>
        <AvatarFallback>Loading...</AvatarFallback>
      </Avatar>
    );
  }

  // If session is not found, show not signed in state
  if (!session) {
    return <div>Not signed in</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
              className="rounded-full"
              width={24}
              height={24}
            />
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SettingsIcon />
            <p className="font-medium">Settings</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Sign out button */}
          <DropdownMenuItem>
            <Button variant="ghost" onClick={() => authClient.signOut()}>
              <LogOutIcon />
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
