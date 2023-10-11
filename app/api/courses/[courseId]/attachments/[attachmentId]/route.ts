import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




export async function DELETE(req:Request, {params}: {params: {attachmentId: string, courseId: string}}) {
  try {
    
    const {userId} = auth();

    if(!userId) {
      return new NextResponse("No autorizado", {status: 401})
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    })
    
    if(!courseOwner){
      return new NextResponse("Sin autorizacion", {status: 401})
    }

    const attachment = await db.attachment.delete({
      where:
      {
        courseId: params.courseId,
        id: params.attachmentId,
      }
    })

    return NextResponse.json(attachment)

  } catch (error) {
    
  }
}