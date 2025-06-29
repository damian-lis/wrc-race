'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { Race } from '@/types';

interface RaceTableProps {
  onRowClick: (race: Race) => void;
  onDelete: (raceId: string) => void;
  races: Race[];
  loading: boolean;
}

export const RaceTable = ({
  onRowClick,
  onDelete,
  races,
  loading,
}: RaceTableProps) => {
  return (
    <div className="relative">
      <Table className="rounded-md overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black rounded-tl-md">
              DATE
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black">
              COUNTRY
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black">
              STAGE
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black">
              CAR CLASS
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black">
              CAR
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black">
              SURFACE
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black">
              TIME
            </TableHead>
            <TableHead className="bg-gray-400 text-center font-bold border-1 border-black w-10 rounded-tr-md" />
          </TableRow>
        </TableHeader>

        <TableBody className={loading ? 'h-10' : 'h-auto'}>
          {races.map((race, index) => {
            const isLastRow = index === races.length - 1;
            return (
              <TableRow
                key={race.id}
                className="bg-gray-200 hover:bg-gray-300/70 cursor-pointer"
                onClick={() => onRowClick(race)}
              >
                <TableCell
                  className={`border-1 text-center border-black ${
                    isLastRow ? 'rounded-bl-md' : ''
                  }`}
                >
                  {new Date(race.date)
                    .toLocaleDateString('en-GB')
                    .replace(/\//g, '-')}
                </TableCell>
                <TableCell className="border-1 text-center border-black">
                  {race.country}
                </TableCell>
                <TableCell className="border-1 text-center border-black">
                  {race.stage}
                </TableCell>
                <TableCell className="border-1 text-center border-black">
                  {race.carClass}
                </TableCell>
                <TableCell className="border-1 text-center border-black">
                  {race.car}
                </TableCell>
                <TableCell className="border-1 text-center border-black">
                  {race.surface}
                </TableCell>
                <TableCell className="border-1 text-center border-black">
                  {race.time}
                </TableCell>
                <TableCell
                  className={`border-1 text-center border-black w-10 ${
                    isLastRow ? 'rounded-br-md' : ''
                  }`}
                >
                  <Button
                    className=" hover:bg-transparent cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation(); // keep row click from firing
                      onDelete(race.id!);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 cursor-progress z-10">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
    </div>
  );
};
