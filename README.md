README for PrOOF
================
An online proof editor

Goals
------
 * Formal Proof Editor with enough strength to handle arithmetic.
 * Flexible enough to use different sets of basic axioms.
 * Allow Hoare logic over a turing complete programming language.

Design
-------
  The initial design is based off of metamath, although I might bite the bullet 
on quantifiers. Specifically I will use a pattern matching system for a rule
set. However it seems likely that having free and bound variables vs. distinct
and possibly non-distinct variables would be simpler from a logical standpoint,
even if it requires more code. For convenience, the code will be broken up into
different types: operators, properties, variables, and formulas.

Note: for the following section return etc. refers to the type of a variable.

Operators are either quantifiers or relations. A quantifier such as for all, or
there exits binds a variable and makes a statement about that variable. They
take in a variable name and return a formula. Relations take in formulas and
return formulas.

Variables are the basic elements of the universe. In the initial axiom they
will represent sets, and propertes will be used for ZFC specification and
replacement.

Formulas are logical elements, in classical logic they are either true or
false for a given universe (LEM). They can take arguments to signal unification.

For instance we can create the following axioms for propositional calculus

            |- a -> (b -> a)
            |- (a -> (b -> c)) -> (a -> b) -> (a -> c)
            |- (!a -> !b) -> (b -> a)
    a, a->b |- b

 

