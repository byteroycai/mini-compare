import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useState, useEffect } from "react";
import DiffViewer, { DiffResult } from "./DiffViewer";
import LinedTextarea from "@/components/LinedTextarea";

export default function App() {
  const [left, setLeft] = useState("Hello world\nThis is left");
  const [right, setRight] = useState("Hello Word!\nThis is right");
  const [diff, setDiff] = useState<DiffResult | null>(null);

  useEffect(() => {
    const fetchDiff = async () => {
      const result = await invoke<DiffResult>("diff_texts", { left, right });
      setDiff(result);
    };
    fetchDiff();
  }, [left, right]);

  return (
    <div className="h-screen grid grid-rows-2">
      <div className="grid grid-cols-2 gap-4 p-4">
        <LinedTextarea value={left} onChange={setLeft} placeholder="Left input" />
        <LinedTextarea value={right} onChange={setRight} placeholder="Right input" />
      </div>

      {diff && <DiffViewer diff={diff} />}
    </div>
  );
}
