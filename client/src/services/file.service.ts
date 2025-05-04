// File handling utilities
export const downloadCSV = (filePath: string) => {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = `${new Date().toISOString()}-freepik-assets.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Preview CSV content
export const previewCSV = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").map((row) => row.split(","));
      resolve(rows);
    };

    reader.onerror = () => reject("Failed to read file");
    reader.readAsText(file);
  });
};
