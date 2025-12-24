import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-client";

const SocialAuthButtons = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Button
        type="button"
        className="w-full"
        onClick={() => signInWithGoogle()}
        variant="outline"
      >
        Sign In with Google
      </Button>
    </div>
  );
};

export default SocialAuthButtons;
