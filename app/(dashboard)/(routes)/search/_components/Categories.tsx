"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import {
  FcEngineering,
  FcFeedIn,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Programacion: FcMultipleDevices,
  Audiovisual: FcFilmReel,
  Musica: FcMusic,
  Cocina: FcFeedIn,
  Ingenieria: FcEngineering,
  Fitness: FcSportsMode,
};
const Categories = ({ items }: CategoriesProps) => {
  console.log(items);
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
