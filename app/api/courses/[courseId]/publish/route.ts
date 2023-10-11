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
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if(!course) {
      return new NextResponse("No encontrado", {status: 404});
    }

    const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

    if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapters ) {
      return new NextResponse("Faltan campos por rellenar...", {status: 401});
    }


    const publishedChapter = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      }
    })
    
    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[COURSE_PUBLISH]:", error);
    return new NextResponse("Error interno", {status: 500});
  }
}