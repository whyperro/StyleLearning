const isTeacher = (userId: string) => {

  const authorized = userId === process.env.NEXT_PUBLIC_TEACHER_ID;

  return ( authorized );
}
 
export default isTeacher;