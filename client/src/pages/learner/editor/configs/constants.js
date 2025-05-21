export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const CODE_SNIPPETS = {
  javascript: `// JavaScript - A beginner's example
// This is a comment - the computer ignores this text

// 1. Let's create some variables
const name = "Student";
let score = 95;

// 2. Create a simple function that prints a greeting
function greet(personName) {
  console.log("Welcome to JavaScript, " + personName + "!");
  console.log("Your score is: " + score + "/100");
}

// 3. Call our function
greet(name);

// 4. Let's try a simple calculation
const addition = 5 + 7;
console.log("5 + 7 = " + addition);

// 5. Try changing the name and score values above!
`,

  typescript: `// TypeScript - A beginner's example
// TypeScript adds type safety to JavaScript

// 1. Define a Student type with name and score properties
type Student = {
  name: string;
  score: number;
};

// 2. Create a student object with our defined type
const student: Student = {
  name: "Learner",
  score: 92
};

// 3. Create a function that requires a Student type
function greet(student: Student) {
  console.log("Welcome to TypeScript, " + student.name + "!");
  console.log("Your score is: " + student.score + "/100");
}

// 4. Call our function with the student object
greet(student);

// 5. Simple math with type safety
const sum: number = 10 + 15;
console.log("10 + 15 = " + sum);

// Try changing the student values above!
`,

  python: `# Python - A beginner's example
# This is a comment - the computer ignores this text

# 1. Let's create some variables
name = "Learner"
score = 90

# 2. Create a simple function that prints a greeting
def greet(person_name):
    print("Welcome to Python, " + person_name + "!")
    print("Your score is: " + str(score) + "/100")

# 3. Call our function
greet(name)

# 4. Let's try a simple calculation
addition = 5 + 7
print("5 + 7 = " + str(addition))

# 5. Create a simple list (array)
fruits = ["apple", "banana", "orange"]
print("First fruit: " + fruits[0])

# Try changing the name and score values above!
`,

  java: `// Java - A beginner's example
// Java requires a class structure

public class HelloWorld {
    // Main method - the starting point of our program
    public static void main(String[] args) {
        // 1. Create some variables
        String name = "Student";
        int score = 88;
        
        // 2. Print a greeting
        System.out.println("Welcome to Java, " + name + "!");
        System.out.println("Your score is: " + score + "/100");
        
        // 3. Simple math operation
        int sum = 10 + 15;
        System.out.println("10 + 15 = " + sum);
        
        // 4. Try changing the name and score values above!
    }
}
`,

  csharp: `// C# - A beginner's example
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            // 1. Create some variables
            string name = "Learner";
            int score = 85;
            
            // 2. Print a greeting
            Console.WriteLine("Welcome to C#, " + name + "!");
            Console.WriteLine("Your score is: " + score + "/100");
            
            // 3. Simple math operation
            int sum = 10 + 15;
            Console.WriteLine("10 + 15 = " + sum);
            
            // 4. Try changing the name and score values above!
        }
    }
}
`,

  php: `<?php
// PHP - A beginner's example
// PHP code is executed on the server

// 1. Create some variables
$name = "Student";
$score = 91;

// 2. Create a simple function that prints a greeting
function greet($personName, $personScore) {
    echo "Welcome to PHP, " . $personName . "!<br>";
    echo "Your score is: " . $personScore . "/100<br>";
}

// 3. Call our function
greet($name, $score);

// 4. Let's try a simple calculation
$addition = 5 + 7;
echo "5 + 7 = " . $addition . "<br>";

// 5. Try changing the name and score values above!
?>
`
};
