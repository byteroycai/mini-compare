// components/LinedTextarea.tsx
import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LinedTextarea({
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = value.split("\n").length;
  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join("\n");

  useEffect(() => {
    const ta = textareaRef.current;
    const gutter = gutterRef.current;
    if (!ta || !gutter) return;

    const handleScroll = () => {
      gutter.scrollTop = ta.scrollTop;
    };

    ta.addEventListener("scroll", handleScroll);
    return () => ta.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex font-mono text-sm border rounded overflow-hidden bg-white">
      <div
        ref={gutterRef}
        className="bg-gray-100 text-gray-500 text-right px-2 py-2 whitespace-pre select-none leading-5 overflow-hidden min-w-[2.5rem]"
      >
        {lineNumbers}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`resize-none border-none rounded-none focus-visible:ring-0 focus-visible:outline-none leading-5 ${className}`}
      />
    </div>
  );
}
