"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { categoriesWithCars, countriesWithStages } from "./data";

import { Race } from "@/types";
import { RaceDialog } from "@/components/race-dialog";
import { API_URL } from "./constants";
import { RaceTable } from "@/components/race-table";

export default function Home() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [raceToUpdate, setRaceToUpdate] = useState<Race>();

  const [countryFilter, setCountryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [carClassFilter, setCarClassFilter] = useState("");
  const [carFilter, setCarFilter] = useState("");

  const clearFilters = () => {
    setCountryFilter("");
    setStageFilter("");
    setCarClassFilter("");
    setCarFilter("");
  };

  const carsPerClass =
    categoriesWithCars.find((car) => carClassFilter === car.category)?.cars || [];

  const stagesWithDistancePerCountry = (
    countriesWithStages.find((countryWithStages) => countryFilter === countryWithStages.country)
      ?.stages || []
  ).map((item) => `${item.name} (${item.distance} km)`);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch races.");
        const data = await res.json();
        setLoading(false);
        setRaces(data);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    fetchRaces();
  }, []);

  const filters = {
    country: countryFilter,
    stage: stageFilter,
    carClass: carClassFilter,
    car: carFilter,
  };

  const filteredRaces = races.filter((race) =>
    Object.entries(filters).every(
      ([key, value]) => !value || race[key as keyof typeof race] === value
    )
  );

  return (
    <>
      <RaceDialog
        open={open}
        setOpen={setOpen}
        defaultValue={raceToUpdate}
        onConfirm={(race) => {
          setRaces((prev) => {
            const exists = prev.some((r) => r.id === race.id);
            if (exists) {
              return prev.map((r) => (r.id === race.id ? race : r));
            } else {
              return [...prev, race];
            }
          });
        }}
      />
      <div className=" px-10 pb-10 bg-gray-900 min-h-screen">
        <div className="max-w-[1900px] mx-auto">
          <div className="flex justify-end p-8 px-0">
            <Button
              onClick={() => {
                setRaceToUpdate(undefined);
                setOpen(true);
              }}
            >
              ADD
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center pt-5">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <Select
                  value={countryFilter}
                  onValueChange={(country) => {
                    setCountryFilter(country);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="COUNTRY" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesWithStages.map((item) => (
                      <SelectItem key={item.country} value={item.country}>
                        {item.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  disabled={!countryFilter.length}
                  value={stageFilter}
                  onValueChange={setStageFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="STAGE" />
                  </SelectTrigger>
                  <SelectContent>
                    {stagesWithDistancePerCountry.map((item) => {
                      return (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select
                  value={carClassFilter}
                  onValueChange={(item) => {
                    setCarClassFilter(item);
                    setCarFilter("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="CAR CLASS" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesWithCars.map((item) => (
                      <SelectItem key={item.category} value={item.category}>
                        {item.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select disabled={!carClassFilter} value={carFilter} onValueChange={setCarFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="CAR" />
                  </SelectTrigger>
                  <SelectContent>
                    {carsPerClass.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!countryFilter && !stageFilter && !carClassFilter && !carFilter}
                  variant="warning"
                  onClick={clearFilters}
                >
                  RESET
                </Button>
              </div>
              <RaceTable
                races={filteredRaces}
                onRowClick={(race) => {
                  setOpen(true);
                  setRaceToUpdate(race);
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
