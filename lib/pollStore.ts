import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { TeamLevel } from "./types";

export type PollUser = {
  id: string;
  name: string;
  email: string;
  passHash: string;
  createdAt: string;
};

export type PollVote = {
  weekId: string;
  userId: string;
  level: TeamLevel;
  number: number;
  at: string;
};

export type PollStore = {
  users: PollUser[];
  votes: PollVote[];
};

const empty = (): PollStore => ({ users: [], votes: [] });

function localPath() {
  return path.join(process.cwd(), "data", "poll-store.json");
}

function tmpPath() {
  return path.join("/tmp", "mesa-poll-store.json");
}

let file = localPath();

async function tryRead(p: string): Promise<PollStore | null> {
  try {
    const raw = await readFile(p, "utf8");
    const data = JSON.parse(raw) as PollStore;
    if (!Array.isArray(data.users) || !Array.isArray(data.votes)) return empty();
    return data;
  } catch {
    return null;
  }
}

export async function loadStore(): Promise<PollStore> {
  const fromLocal = await tryRead(localPath());
  if (fromLocal) {
    file = localPath();
    return fromLocal;
  }
  const fromTmp = await tryRead(tmpPath());
  if (fromTmp) {
    file = tmpPath();
    return fromTmp;
  }
  return empty();
}

export async function saveStore(store: PollStore) {
  const payload = JSON.stringify(store, null, 2);
  const targets = file === tmpPath() ? [tmpPath()] : [localPath(), tmpPath()];
  let lastErr: unknown;
  for (const target of targets) {
    try {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, payload, "utf8");
      file = target;
      return;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("poll store is not writable");
}
