import 'jspdf';

interface AutoTableColumn {
  header: string;
  dataKey: string;
}

interface AutoTableOptions {
  startY?: number;
  head?: (string | string[])[];
  body?: (string | string[])[];
  columns?: AutoTableColumn[];
  styles?: {
    fontSize?: number;
    [key: string]: unknown; // still using any here but can be extended
  };
  [key: string]: unknown; // fallback for other props
}

declare module 'jspdf-autotable' {
  export default function autotable(doc: jsPDF, options: AutoTableOptions): jsPDF;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}
