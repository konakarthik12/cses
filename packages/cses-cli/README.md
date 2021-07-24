[![npm](https://img.shields.io/npm/v/cses-cli)](https://www.npmjs.com/package/cses-cli)

CSES problem set command-line interface
![](demo/demo.gif)

# Installation

Install cses-cli via npm

```bash
npm i -g cses-cli
```

or yarn

```bash
yarn add --global cses-cli
```

# Setup

## Login

Run `cses login` to save credentials locally

Use same username and password as cses.fi

## Setup

Run `cses setup` to set up default settings used for testing and submitting problems

The table below contains some common configurations used by cses (view more details [here](https://cses.fi/howto/))

Language (option)| Submission file| Compile Step  |   Run step | Version
------------ | ------------- | ------------- | ------------- |    -------------
Assembly     | main.asm | nasm -f elf main.asm && gcc main.o| ./a.out        | NASM 2.13.02
C++ (C++11) | main.cpp| g++ -std=c++11 -O2 -Wall main.cpp| ./a.out | g++ 7.5.0
C++ (C++17) | main.cpp| g++ -std=c++17 -O2 -Wall main.cpp| ./a.out |g++ 7.5.0
Haskell |main.hs| ghc main.hs | ./main |    GHC 8.10.4
Java |main.java| javac main.java | java main |    Java 11.0.10
Node.js |main.js| N/A | node main.js | Node.js 8.10.0
Pascal |main.pp| N/A | fpc main.pp -O2 | FPC 3.0.4
Python 2 (CPython2) | main.py | N/A | python2 main.py|CPython 2.7.17
Python 2 (Pypy2)    | main.py | N/A | pypy main.py|PyPy 2.7.18
Python 3 (CPython3) | main.py | N/A | python3 main.py|CPython 3.6.9
Python 3 (Pypy3)    | main.py | N/A | pypy3 main.py|PyPy 3.7.10
Ruby   | main.rb | N/A | ruby main.rb|ruby 2.5.1
Rust   | main.rs |rustc main.rs|./main| rustc 1.47.0|

# Usage

```
$ cses
Usage: index [options] [command]

Options:
  -h, --help      display help for command

Commands:
  login           store cses username and password for login
  select          set current cses problem
  setup           setup cses submission config
  status          check cses profile status
  submit          submit cses problem
  test [id]       run test case against active problem
  help [command]  display help for command
```
