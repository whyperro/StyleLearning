import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request, {params}: {params: {courseId: string}}) {
  try {

    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autorizado", {status: 401});
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    });

    if(!course) {
      return new NextResponse("No encontrado", {status: 404});
    }

    const unpublishedChapter = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      }
    })
    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[COURSE_UNPUBLISH]:", error);
    return new NextResponse("Error interno", {status: 500});
  }
}