import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";



export async function PATCH(req:Request, {params} : {params: {courseId: string, chapterId: string}}) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autorizado",{ status: 401});
    }

    const ownerCourse = db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    })

    if(!ownerCourse) {
      return new NextResponse("No autorizado",{ status: 401});
    }

    const chapter = await db.chapter.findUnique({
      where:{
        id: params.chapterId,
        courseId: params.courseId,
      }
    })

    if(!chapter) {
      return new NextResponse("Not found", {status: 404})
    }

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      }
    });

    if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Faltan campos por completar", {status: 404})
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[PUBLISH]", error)
  }
}