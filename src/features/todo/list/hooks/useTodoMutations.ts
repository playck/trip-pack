import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";
import { todoKeys } from "./useTodoChecklist";
import {
  createTodoCategory,
  updateTodoCategory,
  deleteTodoCategory,
  createTodoItem,
  updateTodoItem,
  deleteTodoItems,
  deleteTodoItem,
} from "../services/api";
import type {
  UseCreateTodoCategoryParams,
  UseCreateTodoItemParams,
  UseUpdateTodoItemParams,
} from "../../type";

export function useCreateTodoCategory(
  tripId: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<UseCreateTodoCategoryParams, "tripId">) =>
      createTodoCategory({ tripId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoKeys.checklist(tripId),
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

export function useUpdateTodoCategory(
  tripId?: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      categoryId: string;
      categoryName: string;
      iconKey: string;
    }) => updateTodoCategory(params),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
        });
      }
      toaster.create({
        title: "카테고리가 수정되었습니다",
        type: "success",
        duration: 2000,
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "카테고리 수정 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useDeleteTodoCategory(tripId?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (categoryId: string) => deleteTodoCategory(categoryId),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
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

export function useCreateTodoItem(
  tripId?: string,
  options?: { onSuccess?: () => void; showToast?: boolean }
) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: (params: UseCreateTodoItemParams) =>
      createTodoItem(params),
    onSuccess: (_, variables) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
        });
      }
      if (showToast) {
        toaster.create({
          title: "할일이 추가되었습니다",
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
          title: "할일 추가 실패",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }
    },
  });
}

export function useUpdateTodoItem(
  tripId?: string,
  options?: { onSuccess?: () => void; showToast?: boolean }
) {
  const queryClient = useQueryClient();
  const { showToast = true } = options ?? {};

  return useMutation({
    mutationFn: (params: UseUpdateTodoItemParams) =>
      updateTodoItem(params),
    onSuccess: (_, variables) => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
        });
      }
      if (showToast) {
        toaster.create({
          title: "할일이 수정되었습니다",
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
          title: "할일 수정 실패",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      }
    },
  });
}

export function useDeleteTodoItems(
  tripId?: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => deleteTodoItems(itemIds),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
        });
      }
      toaster.create({
        title: "할일이 삭제되었습니다",
        type: "success",
        duration: 2000,
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "할일 삭제 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useDeleteTodoItem(
  tripId?: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteTodoItem(itemId),
    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: todoKeys.checklist(tripId),
        });
      }
      toaster.create({
        title: "할일이 삭제되었습니다",
        type: "success",
        duration: 2000,
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "할일 삭제 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}
