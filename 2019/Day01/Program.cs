using System;

namespace AdventOfCode2019.Day01
{
    class Program
    {
        static string[] PUZZLE_INPUT;

        static void Main(string[] args)
        {
            Console.WriteLine("Advent of code 2019 Day 1");
            PUZZLE_INPUT = System.IO.File.ReadAllLines("Input01.txt");

            Console.WriteLine("Task I: {0}", CalculateFuelByMass());
            Console.WriteLine("Task II: {0}", CalculateFuelByMassWithFuelMassCompensation());
        }

        private static int CalculateFuelByMass()
        {
            int fuel_total = 0;
            foreach (var mass in PUZZLE_INPUT)
            {
                fuel_total += getFuel(int.Parse(mass));
            }
            return fuel_total;
        }

        private static int CalculateFuelByMassWithFuelMassCompensation()
        {
            int fuel_total = 0;
            foreach (var mass in PUZZLE_INPUT)
            {
                fuel_total += getFuelCompensated(int.Parse(mass));
            }
            return fuel_total;
        }

        #region Helpers

        private static int getFuel(int mass)
        {
            int fuel = (int)Math.Floor((decimal)(mass/3)) - 2;
            return fuel > 0 ? fuel : 0;
        }

        private static int getFuelCompensated(int mass)
        {
            int fuel = getFuel(mass);
            if (fuel > 0)
            {
                fuel += getFuelCompensated(fuel);
            }
            return fuel;
        }

        #endregion
    }
}
