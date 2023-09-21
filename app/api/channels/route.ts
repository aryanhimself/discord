import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const { name, type } = await req.json();
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server Id missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be general", { status: 400 });
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
          create: {
            profileId: profile.id,
            name: name,
            type: type,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (err) {
    console.log("[Channel_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
