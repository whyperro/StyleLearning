"use client";
import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ChapterList from "./ChapterList";
import debounce from "lodash.debounce";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => setIsCreating((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Capitulo creado");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Algo salio mal...");
    }
  };

  const debouncedOnReorder = useMemo(
    () =>
      debounce(async (updatedData: { id: string; position: number }[]) => {
        try {
          setIsUpdating(true);
          await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
            list: updatedData,
          });
          toast.success("Capítulos reordenados correctamente");
          router.refresh();
        } catch {
          toast.error("Algo salió mal...");
        } finally {
          setIsUpdating(false);
        }
      }, 1500),
    [] // Dependencia vacía para que se cree una única vez
  );

  const onReorder = (updatedData: { id: string; position: number }[]) => {
    debouncedOnReorder(updatedData);
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Capitulos del Curso
        <Button onClick={toggleCreating} variant={"ghost"}>
          {isCreating && <>Cancelar</>}
          {!isCreating && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir un capitulo
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.j  'Introducción del curso...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting}>Crear</Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && "Sin capitulos..."}
          <ChapterList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && initialData.chapters.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          Arrastre para re-ordenar sus capitulos.
        </p>
      )}
    </div>
  );
};
