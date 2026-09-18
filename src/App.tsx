/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FolderGit2, Upload, FileCode2, Terminal, CheckCircle2 } from 'lucide-react';

export default function App() {
  return (
    <main
      id="workspace-container"
      className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 antialiased select-none"
    >
      <div
        id="status-card"
        className="w-full max-w-lg bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            id="status-icon-badge"
            className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"
          >
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="workspace-title" className="text-lg font-semibold tracking-tight text-zinc-100">
                Чистый репозиторий готов
              </h1>
              <span
                id="live-badge"
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready
              </span>
            </div>
            <p id="workspace-subtitle" className="text-xs text-zinc-400 mt-0.5">
              Рабочая среда настроена и ожидает загрузки файлов проекта
            </p>
          </div>
        </div>

        <div id="action-guide" className="space-y-3 mb-6 text-sm text-zinc-300">
          <div
            id="guide-step-1"
            className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/50"
          >
            <Upload className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-zinc-200 text-xs">Загрузка файлов</p>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Перетащите файлы в файловый проводник слева или прикрепите их сообщением в чат.
              </p>
            </div>
          </div>

          <div
            id="guide-step-2"
            className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/50"
          >
            <FileCode2 className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-zinc-200 text-xs">Совместная работа</p>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Как только файлы будут загружены, напишите задачу — я изучу их структуру и сразу приступлю к коду.
              </p>
            </div>
          </div>
        </div>

        <div
          id="environment-specs"
          className="pt-4 border-t border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-500 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
            Vite + React + Tailwind
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            Workspace Active
          </span>
        </div>
      </div>
    </main>
  );
}

