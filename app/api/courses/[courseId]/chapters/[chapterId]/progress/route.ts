import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"



export async function PUT(req:Request, {params} : {params: {courseId: string, chapterId: string}}) {
  

  try {
    
    const {userId} = auth();
    const {isCompleted} = await req.json();

    if(!userId){
      return new NextResponse("No autorizado", {status: 401})
    }

    const existingUserProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
    });
    
    if (existingUserProgress) {
      const updatedUserProgress = await db.userProgress.update({
        where: {
          userId_chapterId: {
            userId,
            chapterId: params.chapterId,
          },
        },
        data: {
          isCompleted,
        },
      });
      return NextResponse.json(updatedUserProgress);
    } else {
      const newUserProgress = await db.userProgress.create({
        data: {
          userId,
          chapterId: params.chapterId,
          isCompleted,
        },
      });
      return NextResponse.json(newUserProgress);
    }

  } catch (error) {
    console.log("CHAPTER_PROGRESS: ", error)
    return new NextResponse("Internal Error", {status: 500})
  }


}