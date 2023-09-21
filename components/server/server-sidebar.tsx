import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChanelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ServerHeader from "./server-heder";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channal";
import ServerMember from "./server-member";

const iconMap = {
  [ChanelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChanelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChanelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4  text-rose-500" />,
};

const ServerSidebar: FC<{
  serverId: string;
}> = async ({ serverId }) => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      chanels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChanel = server?.chanels.filter(
    (channel) => channel.type === ChanelType.TEXT
  );
  const videoChanel = server?.chanels.filter(
    (channel) => channel.type === ChanelType.VIDEO
  );
  const audioChanel = server?.chanels.filter(
    (channel) => channel.type === ChanelType.AUDIO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChanel?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChanel?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChanel?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        <div className="space-y-[2px]">
          {!!textChanel?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChanelType.TEXT}
                role={role}
                label="Text Channels"
              />
              {textChanel.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  channel={channel}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-[2px]">
          {!!audioChanel?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChanelType.TEXT}
                role={role}
                label="Voice Channels"
              />
              {audioChanel.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  channel={channel}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-[2px]">
          {!!videoChanel?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChanelType.TEXT}
                role={role}
                label="Video Channels"
              />
              {videoChanel.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  server={server}
                  channel={channel}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-[2px]">
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                role={role}
                label="Members"
                server={server}
              />
              {members?.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
