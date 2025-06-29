'use client';

import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { categoriesWithCars, countriesWithStages } from './data';
import { Race } from '@/types';
import { RaceDialog } from '@/components/race-dialog';
import { API_URL } from './constants';
import { RaceTable } from '@/components/race-table';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [raceToUpdate, setRaceToUpdate] = useState<Race>();

  const [countryFilter, setCountryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [carClassFilter, setCarClassFilter] = useState('');
  const [carFilter, setCarFilter] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const hasValidKey =
    localStorage.getItem('#$#@!ADas') === process.env.NEXT_PUBLIC_KEY;

  const clearFilters = () => {
    setCountryFilter('');
    setStageFilter('');
    setCarClassFilter('');
    setCarFilter('');
    setSearchQuery('');
  };

  const carsPerClass =
    categoriesWithCars.find((car) => carClassFilter === car.category)?.cars ||
    [];

  const stagesWithDistancePerCountry = (
    countriesWithStages.find(
      (countryWithStages) => countryFilter === countryWithStages.country,
    )?.stages || []
  ).map((item) => `${item.name} (${item.distance} km)`);

  const fetchRaces = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch races.');
      const data = await res.json();
      setRaces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, [hasValidKey]);

  const filters = {
    country: countryFilter,
    stage: stageFilter,
    carClass: carClassFilter,
    car: carFilter,
  };

  const filteredRaces = races.filter((race) => {
    // 1️⃣ all dropdown filters must match (or be empty)
    const matchFilters = Object.entries(filters).every(
      ([key, value]) => !value || race[key as keyof Race] === value,
    );

    // 2️⃣ search must match at least one field
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      q === '' ||
      Object.values(race).some((val) => String(val).toLowerCase().includes(q));

    return matchFilters && matchSearch;
  });

  const onDelete = async (raceId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${raceId}`, { method: 'DELETE' });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || 'Failed to delete race');
      }
      fetchRaces();
    } catch (err) {
      console.error('Error deleting race:', err);
    }
  };

  const [key, setKey] = useState('');

  const onKeyApply = () => {
    localStorage.setItem('#$#@!ADas', key);
    window.location.reload();
  };

  if (!hasValidKey)
    return (
      <div className="px-10 pb-10 bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="w-1/3 flex gap-3">
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className=" bg-gray-100"
          />
          <Button onClick={onKeyApply}>APPLY</Button>
        </div>
      </div>
    );

  return (
    <>
      <RaceDialog
        open={open}
        setOpen={setOpen}
        defaultValue={raceToUpdate}
        onConfirm={fetchRaces}
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
          <div className="mb-4">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-200"
            />
          </div>
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
                setCarFilter('');
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

            <Select
              disabled={!carClassFilter}
              value={carFilter}
              onValueChange={setCarFilter}
            >
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
              disabled={
                !countryFilter &&
                !stageFilter &&
                !carClassFilter &&
                !carFilter &&
                !searchQuery
              }
              variant="warning"
              onClick={clearFilters}
            >
              RESET
            </Button>
          </div>
          <RaceTable
            loading={loading}
            races={filteredRaces}
            onRowClick={(race) => {
              setOpen(true);
              setRaceToUpdate(race);
            }}
            onDelete={onDelete}
          />
        </div>
      </div>
    </>
  );
}
