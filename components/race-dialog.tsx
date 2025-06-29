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

interface RaceDialogProps {
  onConfirm: () => void;
  defaultValue?: Race;
  setOpen: (open: boolean) => void;
  open: boolean;
}

export const RaceDialog = ({
  onConfirm,
  defaultValue,
  open,
  setOpen,
}: RaceDialogProps) => {
  const [country, setCountry] = useState('');
  const [stage, setStage] = useState('');
  const [carClass, setCarClass] = useState('');
  const [car, setCar] = useState('');
  const [surface, setSurface] = useState('');
  const [time, setTime] = useState('');

  const [loading, setLoading] = useState(false);

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
  };

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
      setTime('');
    }
  }, [defaultValue, open]);

  if (defaultValue)
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogTitle className="mx-auto text-center text-2xl">
            <b>
              {country} {stage}
            </b>
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
          <div className="mx-auto text-center">
            <div className=" mb-3 mx-auto outline-2 outline-black bg-orange-400 text-black rounded-md px-4 py-1 text-6xl">
              {defaultValue.time}
            </div>
            <div className="flex justify-center mt-8">
              <TimeInput
                value={time}
                onChange={setTime}
                className="scale-[1.5]"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 ">
            <div className="flex justify-between w-full">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                disabled={time.length < 9 || loading}
                onClick={() => {
                  const newRace = {
                    ...defaultValue,
                    country,
                    stage,
                    carClass,
                    surface,
                    car,
                    time,
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
          {defaultValue ? (
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
          {defaultValue ? (
            stage
          ) : (
            <Select
              disabled={!country || !!defaultValue}
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
          {defaultValue ? (
            carClass
          ) : (
            <Select
              disabled={!!defaultValue}
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
          {defaultValue ? (
            car
          ) : (
            <Select
              disabled={!carClass || !!defaultValue}
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
          {defaultValue ? (
            surface
          ) : (
            <Select
              value={surface}
              disabled={!!defaultValue}
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
        <div className="flex items-center gap-x-4">
          <Label className="w-30 max-w-[150px]">Time</Label>
          <div className="flex gap-5 items-center ">
            <TimeInput value={time} onChange={setTime} />
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
