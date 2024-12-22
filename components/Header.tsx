import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      {/* Search */}
      <div className="header-wrapper">
        {/* FileUploader */}
        <form action="">
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
