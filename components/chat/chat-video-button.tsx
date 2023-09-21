"use client";

import React from "react";
import ActionTooltip from "../action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import queryString from "query-string";

const ChatVideoButton = () => {
  const searchParams = useSearchParams();

  const pathName = usePathname();

  const router = useRouter();

  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathName || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  return (
    <ActionTooltip label="Call">
      <button onClick={onClick} className="hover:opacity-75 mr-4 transition">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
