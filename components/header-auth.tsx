import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Se connecter</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-gray-800">Bonjour, {user.email}!</span>
      <form action={signOutAction}>
        <Button type="submit" className="border border-indigo-600 bg-transparent hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg px-5 py-2 transition-all duration-300">
          Se déconnecter
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-3">
      <Button asChild className="border border-indigo-600 bg-transparent hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg px-5 py-2 transition-all duration-300">
        <Link href="/sign-in">Se connecter</Link>
      </Button>
      <Button asChild className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-lg px-5 py-2 shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300">
        <Link href="/sign-up">S'inscrire</Link>
      </Button>
    </div>
  );
}
