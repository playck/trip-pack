import { useSyncExternalStore } from "react";

/**
 * 열려있는 BottomSheet 들의 stack.
 * - 최상단(마지막)에 push 된 시트만 활성(불투명), 나머지는 흐리게 표시되어 클릭 비활성.
 * - React 트리 관계와 무관하게 동작 (sibling/부모-자식/Portal 어디든).
 */

interface BottomSheetStackState {
  nextId: number;
  stack: number[];
  subs: Set<() => void>;
}

const GLOBAL_KEY = "__tripPackBottomSheetStack" as const;

const state: BottomSheetStackState =
  (globalThis as unknown as Record<string, BottomSheetStackState>)[
    GLOBAL_KEY
  ] ??
  ((globalThis as unknown as Record<string, BottomSheetStackState>)[
    GLOBAL_KEY
  ] = {
    nextId: 0,
    stack: [],
    subs: new Set<() => void>(),
  });

const getTopId = (): number | null =>
  state.stack[state.stack.length - 1] ?? null;

const notify = () => {
  state.subs.forEach((cb) => cb());
};

export const pushSheet = (): number => {
  const id = ++state.nextId;
  state.stack.push(id);
  notify();
  return id;
};

export const popSheet = (id: number) => {
  const idx = state.stack.indexOf(id);
  if (idx >= 0) state.stack.splice(idx, 1);
  notify();
};

const subscribe = (cb: () => void): (() => void) => {
  state.subs.add(cb);
  return () => {
    state.subs.delete(cb);
  };
};

export const useTopSheetId = (): number | null =>
  useSyncExternalStore(subscribe, getTopId, getTopId);
