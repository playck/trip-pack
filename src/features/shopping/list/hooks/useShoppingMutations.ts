import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";
import { shoppingKeys } from "./useShoppingChecklist";
import {
  createShoppingCategory,
  deleteShoppingCategory,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItems,
  deleteShoppingItem,
} from "../services/api";
import type {
  UseCreateShoppingCategoryParams,
  UseCreateShoppingItemParams,
  UseUpdateShoppingItemParams,
} from "../../type";

export function useCreateShoppingCategory(
  tripId: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<UseCreateShoppingCategoryParams, "tripId">) =>
      createShoppingCategory({ tripId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shoppingKeys.checklist(tripId),
      });
      toaster.create({
        title: "카테고리가 추가되었습니다!",
        type: "success",
        duration: 2000,
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "카테고리 추가 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useDeleteShoppingCategory(tripId?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (categoryId: string) => deleteShoppingCategory(categoryId),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: shoppingKeys.checklist(tripId),
        });
        navigate({
          to: "/packing/list/$tripId",
          params: { tripId },
        });
      }
      toaster.create({
        title: "카테고리가 삭제되었습니다",
        type: "success",
        duration: 2500,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "카테고리 삭제 실패",
        description: error.message,
        type: "error",
        duration: 2500,
      });
    },
  });
}

export function useCreateShoppingItem(
  tripId?: string,
  options?: { onSuccess?: () => void; showToast?: boolean }
) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: (params: UseCreateShoppingItemParams) =>
      createShoppingItem(params),
    onSuccess: (_, variables) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: shoppingKeys.checklist(tripId),
        });
      }
      if (showToast) {
        toaster.create({
          title: "아이템이 추가되었습니다",
          description: `"${variables.name}" 추가 완료`,
          type: "success",
          duration: 3000,
        });
      }
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      if (showToast) {
        toaster.create({
          title: "아이템 추가 실패",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }
    },
  });
}

export function useUpdateShoppingItem(
  tripId?: string,
  options?: { onSuccess?: () => void; showToast?: boolean }
) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: (params: UseUpdateShoppingItemParams) =>
      updateShoppingItem(params),
    onSuccess: (_, variables) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: shoppingKeys.checklist(tripId),
        });
      }
      if (showToast) {
        toaster.create({
          title: "아이템이 수정되었습니다",
          description: `"${variables.name}" 수정 완료`,
          type: "success",
          duration: 3000,
        });
      }
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      if (showToast) {
        toaster.create({
          title: "아이템 수정 실패",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }
    },
  });
}

export function useDeleteShoppingItems(
  tripId?: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => deleteShoppingItems(itemIds),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: shoppingKeys.checklist(tripId),
        });
      }
      toaster.create({
        title: "아이템이 삭제되었습니다",
        type: "success",
        duration: 2000,
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "아이템 삭제 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useDeleteShoppingItem(
  tripId?: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteShoppingItem(itemId),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: shoppingKeys.checklist(tripId),
        });
      }
      toaster.create({
        title: "아이템이 삭제되었습니다",
        type: "success",
        duration: 2000,
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "아이템 삭제 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}
