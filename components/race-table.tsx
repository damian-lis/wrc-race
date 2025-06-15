"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Race } from "@/types";

interface RaceTableProps {
  onRowClick: (race: Race) => void;
  races: Race[];
}

export const RaceTable = ({ onRowClick, races }: RaceTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 rounded-tl-md border-black">
            DATE
          </TableHead>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 border-black ">
            COUNTRY
          </TableHead>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 border-black">
            STAGE
          </TableHead>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 border-black">
            CAR CLASS
          </TableHead>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 border-black">
            CAR
          </TableHead>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 border-black">
            SURFACE
          </TableHead>
          <TableHead className=" bg-gray-400 text-center font-bold border-1 rounded-tr-md border-black">
            TIME
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {races.map((race, index) => {
          const isLastRow = index === races.length - 1;
          return (
            <TableRow key={index} className="bg-gray-200" onClick={() => onRowClick(race)}>
              <TableCell
                className={`border-1 text-center border-black ${isLastRow ? "rounded-bl-md" : ""}`}
              >
                {new Date(race.date).toLocaleDateString("en-GB").replace(/\//g, "-")}
              </TableCell>
              <TableCell className="border-1 text-center border-black">{race.country}</TableCell>
              <TableCell className="border-1 text-center border-black">{race.stage}</TableCell>
              <TableCell className="border-1 text-center border-black">{race.carClass}</TableCell>
              <TableCell className="border-1 text-center border-black">{race.car}</TableCell>
              <TableCell className="border-1 text-center border-black">{race.surface}</TableCell>
              <TableCell
                className={`border-1 text-center border-black ${isLastRow ? "rounded-br-md" : ""}`}
              >
                {race.time}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
