import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // 1. Total Users
    const totalUsers = await prisma.user.count();

    // 2. User Growth - Users created per month
    const usersByMonth = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: {
        _all: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyUsers = {};
    usersByMonth.forEach((entry) => {
      const month = new Date(entry.createdAt).getMonth() + 1;
      monthlyUsers[month] = (monthlyUsers[month] || 0) + entry._count._all;
    });

    // 3. Weekly User Activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const activityPerDay = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      activityPerDay[formattedDate] = 0;
    }

    weeklyUsers.forEach((user) => {
      const date = user.createdAt.toISOString().split("T")[0];
      if (activityPerDay[date] !== undefined) {
        activityPerDay[date]++;
      }
    });

    return NextResponse.json({
      totalUsers,
      usersByMonth: monthlyUsers,
      weeklyActivity: activityPerDay,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
