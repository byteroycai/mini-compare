import React from "react";

export interface DiffResult {
  left: string[];
  right: string[];
}

interface Props {
  diff: DiffResult;
}

const DiffViewer: React.FC<Props> = ({ diff }) => {
  const maxLines = Math.max(diff.left.length, diff.right.length);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-full font-mono text-sm">
      <div className="overflow-auto bg-gray-100 rounded p-2 border">
        <table className="w-full table-fixed">
          <tbody>
            {Array.from({ length: maxLines }).map((_, i) => {
              const left = diff.left[i] || "";
              const right = diff.right[i] || "";
              const isDiff = left !== right;

              return (
                <tr key={`left-${i}`} className={isDiff ? "bg-red-100" : ""}>
                  <td className="w-8 pr-2 text-right text-gray-400">{i + 1}</td>
                  <td
                    className="whitespace-pre break-words"
                    dangerouslySetInnerHTML={{
                      __html: left || "&nbsp;",
                    }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overflow-auto bg-gray-100 rounded p-2 border">
        <table className="w-full table-fixed">
          <tbody>
            {Array.from({ length: maxLines }).map((_, i) => {
              const left = diff.left[i] || "";
              const right = diff.right[i] || "";
              const isDiff = left !== right;

              return (
                <tr key={`right-${i}`} className={isDiff ? "bg-red-100" : ""}>
                  <td className="w-8 pr-2 text-right text-gray-400">{i + 1}</td>
                  <td
                    className="whitespace-pre break-words"
                    dangerouslySetInnerHTML={{
                      __html: right || "&nbsp;",
                    }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiffViewer;
