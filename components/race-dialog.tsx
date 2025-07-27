import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { TimeInput } from '@/components/time-input';
import { useEffect, useState } from 'react';
import { Race } from '@/types';
import { categoriesWithCars, countriesWithStages } from '@/app/data';
import { API_URL } from '@/app/constants';
import { Checkbox } from './ui/checkbox';
import { twMerge } from 'tailwind-merge';

interface RaceDialogProps {
  onConfirm: () => void;
  defaultValue?: Race;
  setOpen: (open: boolean) => void;
  open: boolean;
  races: Race[];
}

export const RaceDialog = ({
  onConfirm,
  defaultValue,
  open,
  setOpen,
  races,
}: RaceDialogProps) => {
  const [country, setCountry] = useState('');
  const [stage, setStage] = useState('');
  const [carClass, setCarClass] = useState('');
  const [car, setCar] = useState('');
  const [surface, setSurface] = useState('');
  const [time, setTime] = useState('');
  const [racenet, setRacenet] = useState('');

  const [onlyUpdateRacenet, setOnlyUpdateRacenet] = useState(false);

  const [existingRace, setExistingRace] = useState<Race | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const foundRace = races.find(
      (race) =>
        race.country === country &&
        race.stage === stage &&
        race.carClass === carClass &&
        race.car === car &&
        race.surface === surface,
    );

    if (foundRace) {
      setExistingRace(foundRace);
    }
  }, [country, stage, carClass, car, surface, races]);

  const stagesWithDistancePerCountry = (
    countriesWithStages.find(
      (countryWithStages) => country === countryWithStages.country,
    )?.stages || []
  ).map((item) => `${item.name} (${item.distance} km)`);

  const carsPerClass =
    categoriesWithCars.find((car) => carClass === car.category)?.cars || [];

  const clearFields = () => {
    setCountry('');
    setStage('');
    setCarClass('');
    setCar('');
    setSurface('');
    setTime('');
    setRacenet('');
    setExistingRace(null);
  };

  const isBetterTime = checkIsBetterTime(time, defaultValue?.time || '');
  const areTimesEqual = checkAreTimesEqual(time, defaultValue?.time || '');

  const addRace = async (race: Race) => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(race),
      });

      if (!res.ok) {
        throw new Error(`Failed to add race`);
      }
      // to make sure the race is surely added
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        onConfirm();
      }, 300);
    } catch (err) {
      console.error('Error adding/updating race:', err);
    }
  };

  const editRace = async (race: Race) => {
    const updatedRace = { id: defaultValue?.id, ...race };

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${updatedRace.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRace),
      });

      if (!res.ok) {
        throw new Error(`Failed to edit race`);
      }

      // to make sure the race is surely added
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        onConfirm();
      }, 300);
    } catch (err) {
      console.error('Error editing race:', err);
    }
  };

  useEffect(() => {
    if (open) clearFields();
  }, [open]);

  useEffect(() => {
    if (defaultValue) {
      setCountry(defaultValue.country);
      setStage(defaultValue.stage);
      setCarClass(defaultValue.carClass);
      setCar(defaultValue.car);
      setSurface(defaultValue.surface);
      setRacenet(defaultValue.racenet ?? '');
      setTime('');
    }
  }, [defaultValue, open]);

  if (defaultValue || existingRace)
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogTitle className="mx-auto text-center text-2xl">
            <div>
              <b>{country}</b>
            </div>
            <b>{stage}</b>
            <div className="my-1">
              {carClass} {car}
            </div>
            <div
              className={
                surface === 'Wet' ? 'text-blue-600' : 'text-orange-600'
              }
            >
              {surface}
            </div>
          </DialogTitle>
          <div className="mx-auto text-center  bg-blue-200 p-5 rounded-2xl">
            <span className="text-2xl font-bold">RACENET</span>
            <div className="flex justify-center mt-2">
              <TimeInput value={racenet} onChange={setRacenet} />
            </div>
            <div className="flex mt-2">
              <div className="flex items-center gap-3 text-2xl mx-auto">
                <Checkbox
                  id="updateRacenet"
                  onCheckedChange={(checked) => {
                    setOnlyUpdateRacenet(!!checked);
                  }}
                  checked={onlyUpdateRacenet}
                  size="lg"
                />
                <Label className="text-lg" htmlFor="updateRacenet">
                  Only update racenet
                </Label>
              </div>
            </div>
          </div>
          <div
            className={twMerge(
              'mx-auto text-center mt-3 p-5 rounded-2xl',
              onlyUpdateRacenet ? 'bg-gray-200 opacity-50' : 'bg-orange-300',
            )}
          >
            <span className="text-2xl font-bold">YOUR TIME</span>
            <div
              className={twMerge(
                'mt-3 mb-3 mx-auto   text-black rounded-md px-4 py-1 text-6xl',
                onlyUpdateRacenet ? 'bg-gray-300 opacity-50' : 'bg-orange-200',
              )}
            >
              {(defaultValue || existingRace)?.time}
            </div>
            <div className="flex justify-center mt-5 ">
              <TimeInput
                disabled={onlyUpdateRacenet}
                value={time}
                onChange={setTime}
              />
            </div>
            {time.length === 9 &&
              (areTimesEqual ? (
                <div className="bg-red-400 mt-2 rounded-md p-2">
                  Your time is euqal!
                </div>
              ) : (
                !isBetterTime && (
                  <div className="bg-red-400 mt-2 rounded-md p-2">
                    Your time is worst!
                  </div>
                )
              ))}
          </div>
          <DialogFooter className="pt-4">
            <div className="flex justify-between w-full">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                disabled={
                  (!onlyUpdateRacenet && (time.length < 9 || !isBetterTime)) ||
                  loading
                }
                onClick={() => {
                  const newRace = {
                    ...(defaultValue || existingRace),
                    country,
                    stage,
                    carClass,
                    surface,
                    car,
                    time: onlyUpdateRacenet
                      ? (defaultValue || existingRace)?.time || ''
                      : time,
                    racenet,
                    date: new Date().toISOString(),
                  };
                  editRace(newRace);
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogTitle className="mb-3 mx-auto text">Details</DialogTitle>
        <div className="flex items-center gap-x-4">
          <Label className="w-30 max-w-[150px]">Country</Label>
          {defaultValue || existingRace ? (
            country
          ) : (
            <Select
              value={country}
              onValueChange={(item) => {
                setCountry(item);
                setStage('');
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {countriesWithStages.map((item) => (
                  <SelectItem key={item.country} value={item.country}>
                    {item.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <Label className="w-30 max-w-[150px]">Stage</Label>
          {defaultValue || existingRace ? (
            stage
          ) : (
            <Select
              disabled={!country || !!(defaultValue || existingRace)}
              value={stage}
              onValueChange={setStage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
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
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <Label className="w-30 max-w-[150px]">Car class</Label>
          {defaultValue || existingRace ? (
            carClass
          ) : (
            <Select
              disabled={!!(defaultValue || existingRace)}
              value={carClass}
              onValueChange={(item) => {
                setCarClass(item);
                setCar('');
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categoriesWithCars.map((item) => (
                  <SelectItem key={item.category} value={item.category}>
                    {item.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <Label className="w-30 max-w-[150px]">Car</Label>
          {defaultValue || existingRace ? (
            car
          ) : (
            <Select
              disabled={!carClass || !!(defaultValue || existingRace)}
              value={car}
              onValueChange={setCar}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {carsPerClass.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          <Label className="w-30 max-w-[150px]">Surface</Label>
          {defaultValue || existingRace ? (
            surface
          ) : (
            <Select
              value={surface}
              disabled={!!(defaultValue || existingRace)}
              onValueChange={setSurface}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dry">Dry</SelectItem>
                <SelectItem value="Wet">Wet</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <div className="flex items-center gap-x-4">
            <Label className="w-30 max-w-[150px]">Time</Label>
            <div className="flex gap-5 items-center ">
              <TimeInput smallInput value={time} onChange={setTime} />
            </div>
          </div>
          <div className="flex items-center gap-x-4 ">
            <Label className="w-30 max-w-[150px]">Racenet</Label>
            <div className="flex gap-5 items-center ">
              <TimeInput smallInput value={racenet} onChange={setRacenet} />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
              disabled={
                !country ||
                !stage ||
                !carClass ||
                !car ||
                !surface ||
                time.length < 9 ||
                loading
              }
              onClick={() => {
                const newRace = {
                  id: undefined,
                  country,
                  stage,
                  carClass,
                  surface,
                  car,
                  time,
                  racenet,
                  date: new Date().toISOString(),
                };
                addRace(newRace);
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const checkAreTimesEqual = (time1: string, time2: string): boolean => {
  const toMillis = (t: string) => {
    const [m, s, ms] = t.split(/[:.]/).map(Number);
    return m * 60000 + s * 1000 + ms;
  };
  return toMillis(time1) === toMillis(time2);
};

const checkIsBetterTime = (newTime: string, previousTime: string) => {
  const toMillis = (t: string) => {
    const [m, s, ms] = t.split(/[:.]/).map(Number);
    return m * 60000 + s * 1000 + ms;
  };
  return toMillis(newTime) < toMillis(previousTime);
};
