import ExcelJS from 'exceljs';
import { getRedisClient } from '@/lib/redis';

function formatHeader(key: string) {
  // Insert space before each capital letter, then capitalize each word
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // carClass -> car Class
    .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * GET /api/races/export
 * Generates an .xlsx file that contains every race in Redis.
 * Content-Disposition forces a download named races.xlsx.
 */
export async function GET() {
  try {
    // 1️⃣  Pull data from Redis
    const redis = getRedisClient();
    const racesString = await redis.get('races');
    if (!racesString) {
      return new Response(JSON.stringify({ error: 'No race data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const races = JSON.parse(racesString) as Record<string, unknown>[];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mappedRaces = races.map(({ id: _id, date, ...rest }) => ({
      ...rest,
      date: new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));

    // 2️⃣  Build the workbook
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Races');

    // Dynamically derive columns from the first record’s keys
    const first = mappedRaces[0] ?? {};
    const keys = Object.keys(first);
    ws.columns = Object.keys(first).map((key) => ({
      header: formatHeader(key), // formatted column header
      key, // property name in each row object
      width: 20, // default width
    }));

    // Add every race as a row
    mappedRaces.forEach((race) => ws.addRow(race));

    // Color palette for columns (can extend or change)
    const columnColors = ['FFEBEE', 'E8F5E9', 'E3F2FD', 'FFF3E0', 'F3E5F5']; // soft pastel colors

    // Apply styles to each column
    keys.forEach((_, colIndex) => {
      const color = columnColors[colIndex % columnColors.length]; // loop if more cols than colors
      let maxLength = 10; // Minimum width fallback

      for (let rowIndex = 1; rowIndex <= ws.rowCount; rowIndex++) {
        const row = ws.getRow(rowIndex);
        row.height = 22; // Set row height

        const cell = row.getCell(colIndex + 1); // 1-based index

        // Style the cell
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };

        if (rowIndex === 1) {
          cell.font = { bold: true, color: { argb: '000000' } };
        }

        // Determine length of cell content
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      }

      // Set column width based on the longest cell content
      ws.getColumn(colIndex + 1).width = maxLength + 2; // +2 for padding
    });

    // Optional: Adjust header height
    ws.getRow(1).height = 25;

    // 3️⃣  Turn the workbook into a Node buffer
    const buffer = await wb.xlsx.writeBuffer(); // ExcelJS ≥4.0   [oai_citation:0‡GitHub](https://github.com/exceljs/exceljs)

    // 4️⃣  Return the file with download headers
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="races.xlsx"',
        // Optional: tell browsers this is binary
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('Failed to create Excel export:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate export' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
