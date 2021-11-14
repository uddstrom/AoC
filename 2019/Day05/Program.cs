using System;
using System.Collections.Generic;
using System.Linq;

namespace AdventOfCode2019.Day02
{
    static class Extensions
    {
        public static int[] ToIntArray(this int i)
        {
            var str = i.ToString().PadLeft(5, '0');
            var digits = new int[str.Length];
            for (var j = 0; j < digits.Length; j++)
            {
                digits[j] = int.Parse(str.Substring(j, 1));
            }

            return digits;
        }
        public static List<int> ToIntList(this int i)
        {
            return i.ToIntArray().ToList();
        }
    }

    class Instruction
    {
        public int OPCODE;
        public int[] PARM_MODES = new int[3] { 0, 0, 0 };
        public Instruction(int instruction)
        {
            if (instruction < 10)
            {
                OPCODE = instruction;
            }
            else
            {
                var digits = instruction.ToIntList();
                if (digits.Count == 4) digits.Insert(0, 0);
                PARM_MODES[0] = digits[2];
                PARM_MODES[1] = digits[1];
                PARM_MODES[2] = digits[0];
                OPCODE = int.Parse($"{digits[3]}{digits[4]}");
            }
        }
    }

    class Program
    {
        static string[] PUZZLE_INPUT;

        static void Main(string[] args)
        {
            Console.WriteLine("Advent of code 2019 Day 5");

            PUZZLE_INPUT = System.IO.File.ReadAllLines("Input05");
            int[] program = Array.ConvertAll(PUZZLE_INPUT[0].Split(","), int.Parse);
            Console.WriteLine("Task I: {0}", ProcessProgram((int[])program.Clone(), 1));
            Console.ReadLine();
            Console.WriteLine("Task II: {0}", ProcessProgram((int[])program.Clone(), 5));
        }

        private static int ProcessProgram(int[] program, int input)
        {

            int ip = 0; // instruction pointer
            Instruction i = default(Instruction);

            while ((i == null || i.OPCODE != 99) && ip < program.Length)
            {
                i = new Instruction(program[ip]);

                int in1, in2, output_address;

                switch (i.OPCODE)
                {
                    case 1:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        in2 = i.PARM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                        output_address = i.PARM_MODES[2] == 1 ? ip + 3: program[ip + 3];
                        program[output_address] = in1 + in2;
                        ip = ip + 4;
                        break;
                    case 2:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        in2 = i.PARM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                        output_address = i.PARM_MODES[2] == 1 ? ip + 3 : program[ip + 3];
                        program[output_address] = in1 * in2;
                        ip = ip + 4;
                        break;
                    case 3:
                        output_address = program[ip + 1];
                        program[output_address] = input;
                        ip = ip + 2;
                        break;
                    case 4:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        program[0] = in1;
                        Console.WriteLine("Output: {0}", program[0]);
                        ip = ip + 2;
                        break;
                    case 5:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        in2 = i.PARM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                        ip = in1 != 0 ? in2 : ip + 3;
                        break;
                    case 6:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        in2 = i.PARM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                        ip = in1 == 0 ? in2 : ip + 3;
                        break;
                    case 7:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        in2 = i.PARM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                        output_address = i.PARM_MODES[2] == 1 ? ip + 3 : program[ip + 3];
                        program[output_address] = in1 < in2 ? 1 : 0;
                        ip = ip + 4;
                        break;
                    case 8:
                        in1 = i.PARM_MODES[0] == 1 ? program[ip + 1] : program[program[ip + 1]];
                        in2 = i.PARM_MODES[1] == 1 ? program[ip + 2] : program[program[ip + 2]];
                        output_address = i.PARM_MODES[2] == 1 ? ip + 3 : program[ip + 3];
                        program[output_address] = in1 == in2 ? 1 : 0;
                        ip = ip + 4;
                        break;
                    case 99:
                        return program[0];
                    default:
                        throw new Exception($"Unknown opCode: {i.OPCODE}");
                }

            }

            return program[0];
        }


        //private static int[] SearchFor(int[] program, int output)
        //{
        //    for (var noun = 0; noun < 100; noun++)
        //    {
        //        for (var verb = 0; verb < 100; verb++)
        //        {
        //            var prg = (int[])program.Clone();
        //            try
        //            {
        //                var result = ProcessProgram(prg, noun, verb);
        //                if (result == output)
        //                {
        //                    return new int[2] { noun, verb };
        //                }
        //            }
        //            catch
        //            {
        //                // Ignore
        //            }
        //        }
        //    }
        //    throw new Exception($"Could not find output {output}.");
        //}
    }
}
