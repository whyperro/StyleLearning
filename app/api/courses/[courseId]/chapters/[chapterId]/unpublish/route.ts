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


    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      },
      data: {
        isPublished: false
      }
    })

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      }
    })

    if(!publishedChapters.length) {
      await db.course.update({
        where: {
          id: params.courseId,
          userId,
        },
        data: {
          isPublished: false,
        }
      })
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[UNPUBLISH]", error)
  }
}