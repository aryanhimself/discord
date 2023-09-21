import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  bottomRef,
  chatRef,
  count,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) => {
  const [hasInitilize, setHasInitilize] = useState(false);

  useEffect(() => {
    const topdiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topdiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topdiv?.addEventListener("scroll", handleScroll);

    return () => {
      topdiv?.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, chatRef, shouldLoadMore]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topdiv = chatRef.current;

    const shouldAutoScroll = () => {
      if (!hasInitilize && bottomDiv) {
        setHasInitilize(true);
        return true;
      }
      if (!topdiv) {
        return false;
      }

      const distanceFromBottom =
        topdiv.scrollHeight - topdiv.scrollTop - topdiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitilize]);
};
