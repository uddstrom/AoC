using System;
using System.Collections.Generic;
using System.Linq;

namespace AdventOfCode2019.Day03
{
    public struct Coords
    {
        public int x, y, dist;

        public Coords(int p1, int p2, int d)
        {
            x = p1;
            y = p2;
            dist = d;
        }
    }

    class Program
    {
        static string[] PUZZLE_INPUT;

        static void Main(string[] args)
        {
            Console.WriteLine("Advent of code 2019 Day 3");
            PUZZLE_INPUT = System.IO.File.ReadAllLines("Input03.txt");

            string[] L1 = PUZZLE_INPUT[0].Split(",");
            string[] L2 = PUZZLE_INPUT[1].Split(",");

            var visitedByL1 = getVisited(L1);
            var visitedByL2 = getVisited(L2);

            var intersections = getIntersections(visitedByL1, visitedByL2);

            Console.WriteLine("intersections: {0}", intersections.Count);

            var min_manhattan = getManhattanDist(intersections);
            var min_wire = getWireDist(intersections);

            Console.WriteLine("Task I: {0}", min_manhattan);
            Console.WriteLine("Task II: {0}", min_wire);
        }

        private static List<Coords> getIntersections(List<Coords> L1, List<Coords> L2)
        {
            var intersections = new List<Coords>();
            foreach (var n1 in L1)
            {
                foreach (var n2 in L2)
                {
                    if (n1.x == n2.x && n1.y == n2.y)
                    {
                        intersections.Add(new Coords(n1.x, n1.y, n1.dist + n2.dist));
                        break;
                    }
                }
            }
            return intersections;
        }

        private static int getManhattanDist(IEnumerable<Coords> intersections)
        {
            int min = Int32.MaxValue;
            foreach (var node in intersections)
            {
                var dist = Math.Abs(node.x) + Math.Abs(node.y);
                if (dist < min)
                    min = dist;
            }
            return min;
        }


        private static int getWireDist(IEnumerable<Coords> intersections)
        {
            int min = Int32.MaxValue;
            foreach (var node in intersections)
            {
                if (node.dist < min)
                    min = node.dist;
            }
            return min;
        }

        private static List<Coords> getVisited(string[] steps)
        {
            var dx = new Dictionary<string, int>() {
                { "L", -1 },
                { "R", 1 },
                { "U", 0 },
                { "D", 0 },
            };
            var dy = new Dictionary<string, int>() {
                { "L", 0 },
                { "R", 0 },
                { "U", 1 },
                { "D", -1 },
            };

            var visited = new List<Coords>();
            var x = 0;
            var y = 0;
            var dist = 0;

            foreach (var step in steps)
            {
                var cmd = step[0].ToString();
                var change = int.Parse(step.Substring(1));
                for (var i=0; i<change; i++)
                {
                    dist++;
                    x += dx[cmd];
                    y += dy[cmd];
                    visited.Add(new Coords(x, y, dist));
                }
            }

            return visited;
        }
    }
}
