import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server id missing", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("ChannelId id missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        chanels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("[Channel_ID_DELETE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const serverId = searchParams.get("serverId");

    if (name === "general") {
      return new NextResponse("Name cannot be general", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("Server id missing", { status: 400 });
    }
    if (!params.channelId) {
      return new NextResponse("ChannelId id missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        chanels: {
          update: {
            where: {
              id: params.channelId,
              name: {
                not: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("[Channel_ID_DELETE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
