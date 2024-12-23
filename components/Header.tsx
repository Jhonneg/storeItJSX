import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { singOutUser } from "@/lib/actions/user.actions";

export default function Header() {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <form
          action={async () => {
            "use server";

            await singOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              className="w-6"
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
            />
          </Button>
        </form>
      </div>
    </header>
  );
}
