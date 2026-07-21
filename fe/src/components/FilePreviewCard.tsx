interface FilePreviewCardProps {
  fileName: string;
}

function extensionBadge(fileName: string): string {
  const ext = fileName.split(".").pop();
  return ext ? ext.toUpperCase() : "FILE";
}

export default function FilePreviewCard({ fileName }: FilePreviewCardProps) {
  return (
    <div className="file-preview-card flex w-fit flex-col gap-3 rounded-xl border border-border bg-bg px-3 py-2 text-left text-sm text-text">
      <span className="line-clamp-2 max-w-40 break-words">{fileName}</span>
      <span className="w-fit rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
        {extensionBadge(fileName)}
      </span>
    </div>
  );
}
