using System;
using System.Collections.Generic;

namespace AdventOfCode2019.Day04
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Advent of code 2019 Day 4");
            //372304-847060
            var candidates = new List<int>();
            for (var i = 372304; i < 847060; i++)
            {
                if (meetsCriteria(i))
                    candidates.Add(i);
            }

            var candidates2 = new List<int>();
            foreach (var pwd in candidates)
            {
                if (twoAdjacentNoGroup(pwd))
                    candidates2.Add(pwd);
            }

            Console.WriteLine("Task I: {0}", candidates.Count);
            Console.WriteLine("Task II: {0}", candidates2.Count);
        }

        private static bool meetsCriteria(int pwd)
        {
            // The value is within the range given in your puzzle input.
            // It is a six - digit number.
            if (!isSixDigit(pwd))
                return false;


            // Two adjacent digits are the same(like 22 in 122345).
            if (!twoAdjacent(pwd))
                return false;

            // Going from left to right, the digits never decrease; they only ever increase or stay the same(like 111123 or 135679).
            if (!increasingNumbers(pwd))
                return false;

            return true;


        }

        private static bool isSixDigit(int pwd)
        {
            if (pwd < 100000)
                return false;

            if (pwd > 999999)
                return false;

            return true;
        }

        private static bool twoAdjacent(int pwd)
        {
            var pwdStr = pwd.ToString();
            if (
                pwdStr[0] == pwdStr[1] ||
                pwdStr[1] == pwdStr[2] ||
                pwdStr[2] == pwdStr[3] ||
                pwdStr[3] == pwdStr[4] ||
                pwdStr[4] == pwdStr[5]
            )
                return true;


            return false;
        }

        private static bool increasingNumbers(int pwd)
        {
            var pwdStr = pwd.ToString();
            var pwdInt = new int[] {
                (int)pwdStr[0],
                (int)pwdStr[1],
                (int)pwdStr[2],
                (int)pwdStr[3],
                (int)pwdStr[4],
                (int)pwdStr[5],
            };

            if (
                pwdInt[0] <= pwdInt[1] &&
                pwdInt[1] <= pwdInt[2] &&
                pwdInt[2] <= pwdInt[3] &&
                pwdInt[3] <= pwdInt[4] &&
                pwdInt[4] <= pwdInt[5]
            )
                return true;


            return false;
        }

        private static bool twoAdjacentNoGroup(int pwd)
        {
            var pwdStr = pwd.ToString();
            Console.Write(pwd);
            if (
                (pwdStr[0] == pwdStr[1] && pwdStr[1] != pwdStr[2]) ||
                (pwdStr[1] == pwdStr[2] && pwdStr[0] != pwdStr[1] && pwdStr[2] != pwdStr[3]) ||
                (pwdStr[2] == pwdStr[3] && pwdStr[1] != pwdStr[2] && pwdStr[3] != pwdStr[4]) ||
                (pwdStr[3] == pwdStr[4] && pwdStr[2] != pwdStr[3] && pwdStr[4] != pwdStr[5]) ||
                (pwdStr[4] == pwdStr[5] && pwdStr[3] != pwdStr[4])
            )
            {
                Console.WriteLine(", OK");
                return true;
            }

            Console.WriteLine(", --");
            return false;
        }

    }
}
