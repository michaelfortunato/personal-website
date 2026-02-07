#import "/posts/_utils/lib.typ" as lib
#import "@preview/lemmify:0.1.8": *


#let (
  theorem,
  lemma,
  corollary,
  remark,
  proposition,
  definition,
  example,
  proof,
  rules: theorem_rules,
) = default-theorems("theorem_group", lang: "en")

#show: theorem_rules


#show: lib.page.with(title: "Test", keywords: ("Yyoyoyo", "Gabba"))
#set heading(numbering: "1.1")


= Something Something <sec:Some>

#lorem(50)

== Part 2 <subsec:Part2>

#image("/public/projects/8-bit-adder/1-bit-adder-diagram.png")


== yoyo <subsec:yoyo>


$
  integral_(a)^(b) sin^(2)(x^(2) + y^(2) - phi.alt(theta) )
$


#let mtext = text.with(font: "Times New Roman")
$
  1 + 3 = 4
$<eq:addition>


= Terms I Forget Because I Have the Memory of a Chicken <sec:Terms-I-Forget-Because-I-Have-the-Memory-of-a-Chicken>

- For a function $f: X -> Y$, the
  - *Domain* of the function $f$ is $X$.
  - *Co-domain* of the function $f$ is $Y$.
  - *Image* of the function $f$, is the set
    $op("im")(f) = { y bar.v y in Y "and" exists x in X "so that" f(x) = y}$.
    Clearly $op("im")(f) subset.eq mtext("Co-domain of") f$.


= Sets <sec:Sets>

#definition(name: [Binary Relationship $R$])[
  A binary relationship on sets $X$ and $Y$ is a subset
  $R subset.eq X times Y$.
]<def:Binary-Relationship-R>

#definition(name: [Equivalence Relation])[
  An *equivalence relation* is a binary relation (@def:Binary-Relationship-R)
  on sets $X$ and itself ($R subset.eq X times X$) where
  - #strike([*Reflexivity:* $(x_(1), x_(1)) in R <=> (x_(1), x_(1)) in R$.])
  - *Symmetry:* $(x_(1), x_(2)) in R <=> (x_(2), x_(1)) in R$.
  - *Transitivity:* $(x_(1), x_(2)) in R$ and
    $(x_(2), x_(3)) in R => (x_(1), x_(3)) in R$.
  We write $x_(1) tilde.op x_(2)$ iff $(x_(1), x_(2)) in R$.
]<def:Equivalence-Relation>

#definition(name: [Equality of sets])[
  Two finite (maybe infinite) sets $A$ and $B$ are equal iff
  - For every $a in A$, $a$ is in $B$: $forall a in A => a in B$.
  - For every $b in B$, $b$ is in $A$: $forall b in B => b in A$.

]<def:Equality-of-sets>


= Vector Spaces <sec:Vector-Spaces>

#definition(name: [Vector Space])[
  A vector space $V$ is a set $V$ over a field $FF$ with two operations
  $plus: V times V -> V$, and $dot: FF times V -> FF$, that satisfies a notion
  of glueing a set with our known field operations
  $plus_(FF): FF times FF -> FF$, and $times_(FF): FF times FF -> FF$, that is
  adding and scaling. Formally, this set must specify eight properties:

  + $v + w = w + v$ for all $v, w in V$
  + $u + (v + w) = (u + v) + w$, for all $u, v, w in V$
  + *Pseudo-associativity of scalar multiplication*:
    $a dot (b dot v) = (a times_(FF) b) dot v$, for all $a, b in FF, v in V$.
  + *Identity of vector addition*: There exists a $0_(V) in V$ so that for all
    elements $v in V$, we have $v + 0_(V) = v$.
  + *Inverse for vector addition*: $forall v in V, exists (-v) in V$ so that
    $v + (-v) = 0_(V)$.
  + *Distributivity:* $a dot (v + w) = a dot v + a dot w$, and
    $(a +_(FF) b) dot v = a dot v + b dot v$, for all $a, b in F$, and
    $v, w in V$.

]<def:Vector-Space>

#definition(name: [Subspace])[
  Let $X$ be a vector space over the field $FF$. A *subspace* of $X$ is a
  subset $V subset.eq X$ that inherits all the operations of $X$ and is also a
  vector space...That is the literal definition. A better way to assert $V$ is
  a subspace of $X$ is
  - It is as a subset of $X$
  - It contains the additive identity of $X$: $O_(X) in V$.
  - It inherits all the operations of $X$.
  - It is closed under said operations.
  These conditions make $V$ a subspace of $X$, because $V$ is a vector space,
  equipped with the same vector operations as $X$ ,and is a subset of $X$.
]<def:Subspace>

#definition(name: [Matrix])[
  A matrix $A in M(n, m)$ is a _representation_ of a linear function \
  $l: RR^(n) -> RR^(m)$, *with respect to a _chosen_ basis.*
]<def:Matrix>


#definition(name: [Orbit of an element of a $G$-set])[
  Let $X$ be a $G$-set with action $compose$. The *orbit* of an element
  $x in X$ is the set
  $
    op("Orb")(x) = { g compose x bar.v g in G }.
  $

]<def:Orbit-of-aG-set>

#definition(name: [Homogeneous spaces])[
  Let $X$ be a $G$-set with action $pi_(X): G times X -> X$. The action is
  called *transitive* when for any two elements $x, x' in X$, there is always
  some $g in G$, so that $pi_(X)(g, x) = x'$.
]<def:Homogeneous-spaces>

#definition(name: [Orthogonal matrix])[
  An *orthogonal matrix* $Q in RR^(n times n)$ is any matrix so that
  $Q Q^(top) = I$.
]<def:Orthogonal-matrix>

#definition(name: [Projection matrix])[
  A *projection matrix* $P in RR^(n times n)$ is any matrix so that $P P= P$.
]<def:Projection-matrix>

#definition(name: [Notation])[
  $M_(n)(RR) := {A bar.v A "is an" n times n "matrix with entries in " RR}$,
  and. There is a canonical isomorphism $M_(n)(RR) tilde.equiv RR^(n times n)$,
  and so we can think of $M_(n)(RR)$ as a vector space.
]<def:Notation>


#definition(name: [Unitary matrix])[
  A unitary matrix $U in M(CC^(m times n))$ is the complex analogue of a
  orthogonal matrix (@def:Orthogonal-matrix). If $U in M(RR^(m times n))$ that
  means that $U U^(top) = I$.
]<def:Unitary-matrix>

#definition(name: [(Internal) Direct sum])[
  Let $V_(1), V_(2) subset.eq X$ be subspaces of $X$. The *internal direct sum*
  of $V_(1), V_(2)$ is the set
  ${v_(1) + v_(2) bar.v v_(1) in V_(1), v_(2) in V_(2)}$. This set is written
  as $V_(1) plus.o.big V_(2)$. A consequence, $V_(1) plus.o.big V_(2)$ is a
  subspace of $X$ (#underline([prove it])).
]<def:Internal-Direct-sum>

== Equality of Sets Is Confusing
What do we mean when we say $RR^(m)$ is a vector space? Formally, the set of
the vector space (the $quote.l V quote.r$) we speak of is the Cartesian product
$V = underbrace(RR times RR times dots times RR, m mtext("times")) := {(a_(1), ..., a_(m)) bar.v a_(1) in RR,...,a_(m) in RR}$.
The field is $FF = RR$.

An isomorphism of two vector spaces $X, Y$ is a bijective function
$Phi: X -> Y$. Equality is a special case of isomorphism where $Phi$ is the
identity. I used to think that if $V, V^(c) subset.eq RR^(m)$, then there might
be some non-trivial isomorphism $Phi: V plus.o.big V^(c) -> RR^(m)$, but I do
not think that is true. By recognizing that equality in our world means equal
as sets (they have the same members), then in that case
$V plus.o.big V^(c) = RR^(m)$.

Say you have a vector space $RR^(m)$, and you equip it with a basis
$cal(A) = {a_(1), ..., a_(m)}$ and $cal(B) = {b_(1),..., b_(m)}$. If we write
$vec(x_(1), x_(2), dots.v, x_(m))_([cal(A)]) = sum_(i=1)^(m) x_(i)a_(i)$. And
say we have
$vec(x_(1), dots.v, x_(m))_([cal(A)]) = vec(y_(1), dots.v, y_(m))_([cal(B)])$.

The importance--I believe--is there when we start doing applied work. Consider
a function $f$ defined in Pytorch, $f: X -> Y$. But what _is_ $X$? Truly. In
the math world $X$ _is_ the set of real number $RR^(m)$ with the basic
operations of addition etc. But in the computer world $X$ is the set of
length-$m$ arrays whose components are real numbers. In this sense, the
computer thinks of $X$ as some bing








= Derivative-Once and For All <sec:Derivative-Once-and-For-All>

Let $f: RR^(m) -> RR^(n)$ be a function between vector spaces $RR^(m)$ and
$RR^(n)$. The derivative of $f$ at point $p in RR^(m)$ is the linear function
$op("D") f(p): RR^(m) -> RR^(n)$ so that
$
  lim_(h -> upright(bold(0))) (norm(f(x + h) - f(x) - op("D") f(p)h))/(norm(h)) = 0.
$

#remark(name: [$op("D") f(p) in L(RR^(m), RR^(n))$])[
  Note that we sometimes denote the set of _linear_ functions between vector
  spaces $V, W$ as
  $L(V, W) := {f bar.v f: V -> W mtext("and") f mtext("is linear").}$. So
  $op("D") f(p) in L(RR^(m), RR^(n))$ in the above case.
]

What does it mean for $op("D") f(p)$ to be linear? It simply means

+ $forall h_(1), h_(2) in RR^(m), quad
  op("D") f(p)(h_(1) + h_(2)) = op("D") f(p)(h_(1)) + op("D") f(p)(h_(2))$.
+ $forall alpha in RR, h in RR^(m), quad
  op("D") f(p)(alpha h) = alpha op("D") f(p)(h)$.

#lemma(name: [The derivative is unique])[
  #text(fill: red)[TODO]
  Let $d_(1) in L(RR^(m), RR^(n)), d_(2) in RR^(n))$ so that ...
]



== Ensign Notes <subsec:Ensign-Notes>

=== Orbits Induce Equivalence Classes <subsubsec:Orbits-Induce-Equivalence-Classes>


Set $X$ be a $G$-set with action $compose$, and denote the orbit of $x in X$
(@def:Orbit-of-aG-set) $op("Orb")(x)$. She then goes onto define the space of
orbits as the quotient
$
  X slash G = { op("Orb")(x) bar.v x in X }
  = {{ g compose x bar.v g in G} bar.v x in X}.
$

#let orb(x) = $op("Orb")(#x)$

A key thing to note is that
${g compose x_(1) bar.v g in G } = {g compose x_(2) bar.v g in G}$ iff
$exists g in G$ so that $x_(2) = g compose x_(1)$. Note that only the forward
direction is interesting to prove. This implicitly defines an equivalence
relation. To see this, note that if $x_(2) = g compose x_(1)$, then for any
$x_(3) = g_(1) x_(1) in op("Orb")(x_(1))$, we see that
$x_(3) in op("Orb")(x_(2))$ because
$x_(3) = g_(1) compose x_(1) = g_(1) compose g compose x_(2)$, and since
$g_(1) compose g in G$ we know that
$g_(1) compose g compose x_(2) in op("Orb")(x_(2)).$. The other way is similar
to show, and we have that every
$x'_(1) in op("Orb")(x_(1)) <=> x'_(1) in op("Orb")(x_(2))$, where in the
forward case we have $x'_(1) in op("Orb")(x_(2))$ because
$x'_(1) = g compose x_(1)$ and since $x_(2) = g_(1) compose x_(1)$. We have
know that at the element $g g^(-1)_(1) in G$, that
$g g^(-1)_(1) x_(2) in op("Orb")(x_(2))$ by definition
$g g_(1)^(-1) x_(2) = g g^(-1)_(1) g_(1) x_(1) = g x_(1) = x'_(1)$.

So anyway, these things induce the equivalence relation $x_(1) tilde.op x_(2)$
iff $x_(1) in op("Orb")(x_(2))$ #footnote[more directly if
  $op("Orb")(x_(1)) = op("Orb")(x_(2)) <=> x_(1) in op("Orb")(x_(2))$]. A
formal way to write this is the set
$
  R = {(x_(1), x_(2)) bar.v orb(x_(1)) = orb(x_(2))} subset.eq X times X.
$
And if you are confused about the $x_(1) ~ x_(2)$ notation all it is is
$x_(1) ~ x_(2)$ iff $(x_(1), x_(2)) in R$.

Ensign concludes this section by defining the function
$
  phi.alt: X -> X slash G.
$
Note that in no way $X slash G$ is a quotient group. However, the best way to
think about $X slash G$ is in terms of _representative_ elements $x in X$. I am
not sure how we can define a consistent way to choose a quotient representative
$x in X$ for each element $orb(x_(1)) in G slash X$, but I _do_ know that
$phi.alt(x_(1)) = x_(2)$ is a valid thing to say.

#remark(name: [Choosing a stable orbit representative])[
  How can we make $phi.alt$ well defined? Meaning for every $x in X$,
  $phi.alt(x) = x'$ if and only if $orb(x) = orb(x')$. For each $orb(x) in X$,
  choose a representative $x in orb(x)$. Then define $phi.alt(x_(1)) = x$ iff
  $x_(1) in orb(x)$. This is tautological and I do not know a better way to
  define $phi.alt$. I do know that
  @kondorGeneralizationEquivarianceConvolution2018 defines it nicely. Actually
  I think they consider homogeneous spaces. I am a bit confused as a $G$-set
  $X$ is a homogeneous when the associated action $pi_(X): G times X -> X$ is
  transitive @def:Homogeneous-spaces. So a homogeneous set induces a quotient
  $G slash X$ with only one element. In other words there is only one orbit.
  But I digress.
]<remark:Choosing-a-stable-orbit-representative>


=== A Perspective on Group Invariant Functions <subsubsec:A-Perspective-on-Group-Invariant-Functions>

So we know the definition of a $G$-invariant function $f: X -> Y$. That is
#definition(name: [$G$-equivariant function $f: X -> Y$])[
  A function $f: X -> Y$ is $G$-invariant iff
  $
    f(g compose x) = f(x) forall g in G, x in X.
  $
  Equivariance is similar:
  $
    f(g compose x) = g star f(x) forall g in G, x in X..
  $
]<def:G-equivariant-function-f:-X---Y>

A key insight is that such a $G$-invariant function $f: X -> Y$ *always*
defined by the function
$
  tilde(f): X slash G -> Y quad tilde(f)(orb(x)) := f(x_("rep")) "where" x in orb(x_("rep")).
$
completely defines this $G$-invariant $f$ at all values in its input, i.e.:
$
  forall x in X, f(x) = f(x_("rep")) "where" x in orb(x_("rep")).
$
In other words, perhaps better words a $G$-invariant function is completely
defined by how the function maps the representative points $x$ in all the
orbits.

I think a key notational confusion is that we overload $X slash G$ to sometimes
denote the space of sets of orbits $X slash G = {orb(x) bar.v x in X}$ and
other-times to denote $G \ X$ as the subset of $G slash X subset.eq X$, where
each element of $X slash G X$ is a chosen representative for the orbit.




