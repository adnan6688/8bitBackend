import { CatType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { calculatePagination } from "../../utils/calculatePegination";
import { ICetegoryPayload, IUpdateCategory } from "./cetegory.interface";

const addCategory = async (payload: ICetegoryPayload, createdById: string) => {
  const { type, name } = payload;

  const ckCategory = await prisma.category.findUnique({
    where: {
      type_name: {
        type,
        name,
      },
    },
  });

  if (ckCategory) {
    throw new Error("This category already exists.");
  }

  const result = await prisma.category.create({
    data: {
      ...payload,
      createdById,
    },
  });

  return result;
};

const getAllCategoryBYTypes = async (
  type: string,
  options: any,
  searchTerm?: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  let whereCondition: any = { isDelete: false };

  if (type && type !== "all") {
    whereCondition.type = type;
  }

  if (searchTerm) {
    whereCondition.name = {
      contains: searchTerm.trim(),
      mode: "insensitive",
    };
  }

  const [catResult, total] = await prisma.$transaction([
    prisma.category.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      omit: {
        createdById: true,
        isDelete: type === "all" ? false : true,
      },
    }),

    prisma.category.count({ where: whereCondition }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: catResult,
  };
};

const updateCategory = async (catId: string, payload: IUpdateCategory) => {
  const ckcat = await prisma.category.findUnique({
    where: {
      id: catId,
    },
  });

  if (!ckcat) {
    throw new Error("This category not found!");
  }

  const update = await prisma.category.update({
    where: {
      id: catId,
    },
    data: {
      ...payload,
    },
  });
  return update;
};

export const cetegoryService = {
  addCategory,
  getAllCategoryBYTypes,
  updateCategory,
};
