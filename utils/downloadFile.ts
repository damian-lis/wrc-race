export async function downloadFile(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Export failed (${res.status})`);
  }

  const blob = await res.blob();
  const objectUrl = window.URL.createObjectURL(blob);

  // Create & click a temporary <a> so the browser shows the save-dialog
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  anchor.remove();

  // Give the browser a tick to register the click, then revoke
  setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
}
