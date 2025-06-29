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
import { Trash2, X, Check, Loader2 } from 'lucide-react';
import { Race } from '@/types';
import { useState } from 'react';

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
  /** If not null, this row is showing the confirm / cancel buttons. */
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  /* ── helpers ─────────────────────────────────────────── */
  const startConfirm = (e: React.MouseEvent, raceId: string) => {
    e.stopPropagation();
    setConfirmingId(raceId);
  };

  const cancelConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingId(null);
  };

  const confirmDelete = (e: React.MouseEvent, raceId: string) => {
    e.stopPropagation();
    onDelete(raceId);
    setConfirmingId(null);
  };

  /* ── render ──────────────────────────────────────────── */
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
            const isConfirming = confirmingId === race.id;

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
                  onClick={(e) => e.stopPropagation()} // keep row click from firing
                >
                  {isConfirming ? (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={cancelConfirm}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => confirmDelete(e, race.id!)}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="hover:bg-transparent"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => startConfirm(e, race.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
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
