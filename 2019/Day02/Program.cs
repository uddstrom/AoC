using System;

namespace AdventOfCode2019.Day02
{
    class Program
    {
        static string[] PUZZLE_INPUT;

        static void Main(string[] args)
        {
            Console.WriteLine("Advent of code 2019 Day 2");
            PUZZLE_INPUT = System.IO.File.ReadAllLines("Input02.txt");

            int[] program = Array.ConvertAll(PUZZLE_INPUT[0].Split(","), int.Parse);

            Console.WriteLine("Task I: {0}", ProcessProgram((int[])program.Clone(), 12, 2));

            var result = SearchFor((int[])program.Clone(), 19690720);
            Console.WriteLine("Task II: noun is {0}, verb is {1} giving answer {2}", result[0], result[1], result[0] * 100 + result[1]);
            Console.WriteLine("Task II check: {0}", ProcessProgram((int[])program.Clone(), result[0], result[1]));
        }


        private static int ProcessProgram(int[] program, int noun, int verb)
        {
            program[1] = noun;
            program[2] = verb;

            for (int i = 0; i < program.Length; i += 4)
            {
                var opCode = program[i];
                var in1 = program[program[i + 1]];
                var in2 = program[program[i + 2]];
                var output = program[i + 3];

                switch (opCode)
                {
                    case 1:
                        program[output] = in1 + in2;
                        break;
                    case 2:
                        program[output] = in1 * in2;
                        break;
                    case 99:
                        return program[0];
                    default:
                        throw new Exception($"Unknown opCode: {opCode}");
                }

            }

            return program[0];
        }

        

        private static int[] SearchFor(int[] program, int output)
        {
            for (var noun = 0; noun < 100; noun++)
            {
                for (var verb = 0; verb < 100; verb++)
                {
                    var prg = (int[])program.Clone();
                    try
                    {
                        var result = ProcessProgram(prg, noun, verb);
                        if (result == output)
                        {
                            return new int[2] { noun, verb };
                        }
                    } catch
                    {
                        // Ignore
                    }
                }
            }
            throw new Exception($"Could not find output {output}.");
        }
    }
}
