import { useRef } from 'react';
import { useStore } from '../store/useStore';
import { buildSnapshot, downloadJson, isValidSnapshot } from '../utils/dataTransfer';

export default function DataControls() {
  const { fighters, weightClasses, events, fights, titleReigns, importData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const snapshot = buildSnapshot({ fighters, weightClasses, events, fights, titleReigns });
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`fight-universe-backup-${date}.json`, snapshot);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    let data: unknown;
    try {
      data = JSON.parse(await file.text());
    } catch {
      alert("Couldn't read that file — make sure it's a valid Fight Universe export.");
      return;
    }

    if (!isValidSnapshot(data)) {
      alert("This file doesn't look like a valid Fight Universe export.");
      return;
    }

    if (!confirm('Importing will replace ALL current data — fighters, events, rankings, everything. This cannot be undone. Continue?')) {
      return;
    }

    importData(data);
    alert('Import complete.');
  }

  return (
    <div className="px-5 py-4 border-t border-neutral-800 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 rounded-md border border-neutral-700 px-2 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
        >
          Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 rounded-md border border-neutral-700 px-2 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
        >
          Import
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
      </div>
      <p className="text-[11px] text-neutral-600">Data is saved locally in this browser.</p>
    </div>
  );
}
