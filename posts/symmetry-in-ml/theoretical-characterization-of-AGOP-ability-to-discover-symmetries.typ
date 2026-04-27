#import "/posts/_utils/lib.typ" as lib
#import "@preview/frame-it:2.0.0": *
#let (definition, proof, lemma, theorem, remark) = frames(
  // You can provide a color or leave it out and it will be generated
  definition: ("Definition",),
  proof: ("Proof",),
  lemma: ("Lemma",),
  theorem: ("Theorem",),
  remark: ("Remark",),
)


#show: frame-style(styles.thmbox)

#show: lib.page.with(
  title: "Theoretical Characterization of AGOP's Ability to Discover Symmetries",
  mini_abstract: "A writing plan for connecting symmetry breaking in RFM to the
  commutant and 2-closure limits of AGOP-based symmetry discovery.",
  keywords: (
    "symmetry-discovery",
    "AGOP",
    "RFM",
    "2-closure",
    "grokking",
  ),
)

== A Personal Aside

I have worked on the problem of "symmetry discovery"
@yangGenerativeAdversarialSymmetry2023 @karjolUnifiedFrameworkDiscovering2024
for the last year. Symmetry discovery can refer to many things, but in my area
it often refers to the ability to learn a group $G$ and/or an input action
$pi_(X): G times X -> X$, that makes a given function $f: X -> Y$ _invariant_:
$f(pi(g, x)) f(x) space forall g in G, x in X$.

At this level of generality, I am not sure there is _any_ claim to make.
Indeed, in #cite(<ensignComplexityExplainingNeural2020>, form: "prose"), it was
shown that not only is the pure problem computationally hard, but that weaker
variants of it are, too.

I was playing around with my copy of the code in
@zhouMetaLearningSymmetriesReparameterization2021, and inspecting the block
circulant weights present in cyclically equivariant functions, when I
remembered my very close friend telling me about his work in studying his
group's algorithm, Recursive Feature Machines (RFM), ability to grok modular
arithmetic @mallinarEmergenceNonneuralModels2025. That is the ability of RFM to
approximate a function $f: ZZ_(p) times ZZ_(p) -> ZZ_(p)$
$
  f(a, b) = a + b mod p,
$
where $p$ is some prime number.

This function is invariant with respect to the following action of the cyclic
group
$
  pi: C_(p) times (ZZ_(p) times ZZ_(p)) -> ZZ_(p) times ZZ_(p) quad
  pi(t, (a,b)) = (a + t, b - t).
$

So could RFM, and better yet the second order statistic it optimizes, the
average gradient outer product, ever give us a hint as to what group $G$ and
action makes a function invariant?


== Introduction <sec:Introduction>

As neural networks get increasingly complex, their representations of the input
data do as well. That makes it harder and harder to explain what the function
is doing to learn its task. The average gradient outer product (AGOP) is an
interesting object in part for its ability to hint which input features a
function considers important to the task @mallinarEmergenceNonneuralModels2025.

In @mallinarEmergenceNonneuralModels2025 it was shown that _Recursive Feature
Machines_ "grokked" modular arithmetic and that the AGOP of the resulting
neural network took on a block circulant form. Modular arithmetic over a field
$ZZ_(p)$ is is invariant with respect to the cyclic group $C_(p)$. That the
AGOP become block-circulant once this $G = C_(p)$-invariant function $f$ was
learned, immediately caught my interest. I am interested under what exact
conditions can a neural network learn the symmetries of its given task. This
was January 2026, and at that point, I was specifically interested in what
"discrete symmetries" could be learned, that is what actions of which finite
groups would induce equivariance.


I thought a group theoretic take on the AGOP was uniquely mine, but it turns
out the very group who created RFM sees a connection too! In fact, #cite(
  <Bernal_Mallinar_Belkin_2026>,
  form: "prose",
) points out that, in fact, modular arithmetic $a + b mod p$ is invariant with
respect to the dihedral group $D_(2 p)$, not just the cyclic group $C_(p)$.

== The formal question <sec:formal-question>

The question I want to isolate is deliberately narrow. Suppose a function has
some permutation symmetry, and suppose we compress the function into one
second-order gradient statistic. What symmetry can that statistic identify?

The answer is not, in general, the original group. A single symmetric AGOP can
see pair-orbit information. That is already useful, but it comes with a sharp
ceiling: under permutation actions, one symmetric second-order matrix can
identify at most the unordered-pair $2$-closure of the acting group.

The rest of this note is the formal version of that sentence.

== Setup and notation <sec:setup-and-notation>

Let $d in NN$ and let $G <= S_d$ be a finite permutation group acting on the
coordinates $[d] = {1, dots, d}$. I write $P_g in RR^(d times d)$ for the
permutation matrix of $g in G$. Let $f: RR^d -> RR$ be differentiable, and let
$X$ be an $RR^d$-valued random variable.

#definition[EGOP and AGOP][
  The _expected gradient outer product_ (EGOP) of $f$ under the law of $X$ is
  $
    C := EE[nabla f(X) nabla f(X)^T] in RR^(d times d).
  $
  Given i.i.d. samples $x_1, dots, x_n$ from the law of $X$, the empirical
  _average gradient outer product_ (AGOP) is
  $
    hat(C) := frac(1, n) sum_(k=1)^n nabla f(x_k) nabla f(x_k)^T.
  $
  Both $C$ and $hat(C)$ are symmetric positive semidefinite matrices.
]<def:egop-agop>

The representation-theoretic object attached to the action is the commutant, or
centralizer algebra,
$
  "End"_G(RR^d)
  :=
  {A in RR^(d times d) : P_g A P_g^T = A " for all " g in G}.
$

#definition[Invariant function and invariant input law][
  Throughout the first part of the note, I use the following two assumptions:

  + The function is $G$-invariant:
    $
      f(P_g x) = f(x)
      quad forall g in G, x in RR^d.
    $
  + The input law is $G$-invariant:
    $
      X " has the same distribution as " P_g X
      quad forall g in G.
    $
]<def:invariant-setting>

These are exactly the assumptions under which the AGOP is expected to inherit
the symmetry of the task rather than the asymmetry of a particular coordinate
presentation or data sampling scheme.

== The commutant constraint <sec:commutant-constraint>

The first point is that invariance of $f$ turns into equivariance of its
gradient.

#lemma[Gradient equivariance][
  Under the function-invariance assumption in @def:invariant-setting, for every
  $g in G$ and $x in RR^d$,
  $
    nabla f(P_g x) = P_g nabla f(x).
  $
]<lem:gradient-equivariance>

#proof[
  The identity $f(P_g x) = f(x)$ says $(f compose g)(x) = f(x)$ for the linear
  map $g(x) = P_g x$. Differentiating with respect to $x$ gives
  $
    nabla (f compose g)(x)
    = P_g^T nabla f(P_g x)
    = nabla f(x).
  $
  Since $P_g^T = P_g^(-1)$, multiplying by $P_g$ gives
  $
    nabla f(P_g x) = P_g nabla f(x).
  $
]

#theorem[The EGOP lies in the commutant][
  Under the invariant setting in @def:invariant-setting, the EGOP satisfies
  $
    P_g C P_g^T = C
    quad forall g in G.
  $
  Equivalently, $C in "End"_G(RR^d)$.
]<thm:egop-in-commutant>

#proof[
  By @lem:gradient-equivariance,
  $
    P_g C P_g^T & = EE[P_g nabla f(X) nabla f(X)^T P_g^T] \
                & = EE[nabla f(P_g X) nabla f(P_g X)^T].
  $
  Because $X$ and $P_g X$ have the same distribution, the final expectation is
  exactly
  $
    EE[nabla f(X) nabla f(X)^T] = C.
  $
]

#lemma[Orbit-constancy of EGOP entries][
  If $C in "End"_G(RR^d)$, then for all $i,j in [d]$ and all $g in G$,
  $
    C_(i j) = C_(g(i) g(j)).
  $
  If $C$ is symmetric, then $C_(i j)$ depends only on the $G$-orbit of the
  unordered pair ${i,j}$.
]<lem:orbit-constancy>

#proof[
  From $P_g C P_g^T = C$, take $(g(i), g(j))$ entries. Equivalently, apply the
  inverse permutation to the displayed entry. The result is
  $
    C_(g(i) g(j)) = C_(i j).
  $
  Symmetry identifies $(i,j)$ and $(j,i)$, so ordered-pair information
  collapses to unordered-pair information.
]

This is the first place where the second-order nature of the AGOP matters. For
a permutation action, a symmetric matrix is naturally an edge-colored complete
graph: the vertices are the coordinates and the color of the edge ${i,j}$ is
$C_(i j)$. The group visible in the matrix is therefore the group that
preserves those edge colors.

== Identifiability from one symmetric matrix <sec:identifiability>

#definition[Automorphism group of a matrix][
  For a matrix $C in RR^(d times d)$, define
  $
    "Aut"(C) := {sigma in S_d : P_sigma C P_sigma^T = C}.
  $
]<def:matrix-automorphism-group>

#lemma[Edge-colored graph interpretation][
  If $C$ is symmetric, then $"Aut"(C)$ is precisely the automorphism group of
  the complete undirected graph on $[d]$ whose edge ${i,j}$ is colored by the
  value $C_(i j)$.
]<lem:edge-colored-graph>

#proof[
  A permutation $sigma$ preserves all edge colors if and only if, for every
  $i,j in [d]$,
  $
    C_(sigma(i) sigma(j)) = C_(i j).
  $
  This entrywise condition is exactly $P_sigma C P_sigma^T = C$.
]

#definition[Unordered-pair $2$-closure][
  Let $cal(O)_2(G)$ be the partition of unordered pairs ${i,j} subset [d]$ into
  $G$-orbits. The unordered-pair $2$-closure of $G$ is
  $
    G^((2))
    :=
    {sigma in S_d :
      sigma " preserves the partition " cal(O)_2(G)}.
  $
  Equivalently, $sigma in G^((2))$ if and only if, for every $i != j$, the
  unordered pairs ${i,j}$ and ${sigma(i), sigma(j)}$ lie in the same $G$-orbit.
]<def:two-closure>

So $G^((2))$ is the largest subgroup of $S_d$ with the same orbit partition on
unordered pairs as $G$. In permutation-group language, groups satisfying
$G = G^((2))$ are called $2$-closed.

#theorem[Symmetric second-order moments identify at most $G^((2))$][
  Assume $C$ is symmetric and $C in "End"_G(RR^d)$. Then
  $
    G <= G^((2)) <= "Aut"(C).
  $
  Moreover, if $C$ is _orbit-separating_, meaning that distinct orbits in
  $cal(O)_2(G)$ receive distinct values of $C_(i j)$, then
  $
    "Aut"(C) = G^((2)).
  $
]<thm:symmetric-second-order-ceiling>

#proof[
  The inclusion $G <= "Aut"(C)$ follows from the commutant condition
  $P_g C P_g^T = C$. The inclusion $G <= G^((2))$ holds because every element
  of $G$ preserves its own unordered-pair orbit partition.

  Now let $sigma in G^((2))$. For every unordered pair ${i,j}$, the pair
  ${sigma(i), sigma(j)}$ lies in the same $G$-orbit as ${i,j}$. By
  @lem:orbit-constancy, $C$ is constant on those unordered-pair orbits, so
  $
    C_(sigma(i) sigma(j)) = C_(i j)
    quad forall i,j.
  $
  Hence $sigma in "Aut"(C)$, and $G^((2)) <= "Aut"(C)$.

  Finally assume $C$ is orbit-separating and take $sigma in "Aut"(C)$. Then
  $C_(sigma(i) sigma(j)) = C_(i j)$ for every unordered pair ${i,j}$. Since
  distinct unordered-pair orbits receive distinct values, this equality forces
  ${sigma(i), sigma(j)}$ to lie in the same $G$-orbit as ${i,j}$. Thus $sigma$
  preserves $cal(O)_2(G)$, so $sigma in G^((2))$. Therefore
  $"Aut"(C) <= G^((2))$, proving equality.
]

#remark[What this theorem does not say][
  @thm:symmetric-second-order-ceiling is an algebraic identifiability
  statement. It says that a single symmetric matrix cannot encode more than
  unordered-pair orbit data. It does not say that $C$ is always
  orbit-separating, and it does not say that $G^((2)) = G$. Many $G$-invariant
  models have much more accidental symmetry. For example, if $C = I$ or
  $C = bold(1) bold(1)^T$, then $"Aut"(C)$ is all of $S_d$. Any positive
  recovery statement therefore needs an explicit separation or margin
  condition.
]

== Cyclic versus dihedral ambiguity <sec:cyclic-dihedral>

The canonical example is the regular cyclic action. Let $n >= 3$ and identify
$[n]$ with $ZZ_n$. Let $P$ be the cyclic shift matrix
$
  (P x)_i = x_(i - 1)
$
with indices taken modulo $n$, and let $R$ be the reversal matrix
$
  (R x)_i = x_(-i).
$
Then $R P R = P^(-1)$, and the subgroup generated by $P$ and $R$ is the
dihedral group $D_(2 n)$.

#lemma[Commutant of a cyclic shift is circulant][
  A matrix $A in RR^(n times n)$ satisfies $P A P^T = A$ -- equivalently,
  $P A = A P$ -- if and only if $A$ is circulant. That is, there exists a
  function $a: ZZ_n -> RR$ such that
  $
    A_(i j) = a_(i - j)
    quad forall i,j in ZZ_n.
  $
]<lem:cyclic-commutant-circulant>

#proof[
  Write the commutation relation as $P A = A P$. In entries,
  $
    (P A)_(i j) = A_(i - 1, j)
    quad "and" quad
    (A P)_(i j) = A_(i, j + 1).
  $
  Hence $A_(i - 1, j) = A_(i, j + 1)$. Iterating this relation shows that
  $A_(i j)$ depends only on $i - j mod n$, so $A_(i j) = a_(i - j)$ for some
  function $a$. The converse is immediate by substituting $A_(i j) = a_(i-j)$
  back into the commutation relation.
]

#lemma[Symmetric shift-commuting matrices are dihedral-invariant][
  If $A$ is symmetric and satisfies $P A P^T = A$, then $R A R = A$.
  Consequently, the dihedral group generated by $P$ and $R$ is contained in
  $"Aut"(A)$.
]<lem:symmetric-circulant-dihedral>

#proof[
  By @lem:cyclic-commutant-circulant, $A_(i j) = a_(i - j)$. Symmetry implies
  $a_k = a_(-k)$. Therefore
  $
    (R A R)_(i j)
    = A_(-i, -j)
    = a_(-i + j)
    = a_(-(i - j))
    = a_(i - j)
    = A_(i j).
  $
]

#theorem[$2$-closure of the cyclic group][
  Let $G = chevron.l P chevron.r <= S_n$ be the cyclic shift group acting
  regularly on $ZZ_n$, with $n >= 3$. Then
  $
    G^((2)) = chevron.l P, R chevron.r = D_(2 n).
  $
  In particular, cyclic and dihedral actions have identical unordered-pair
  orbit partitions.
]<thm:cyclic-two-closure>

#proof[
  The $G$-orbit of an unordered pair ${i,j}$ is determined by the circular
  distance
  $
    "dist"(i,j) := min(|i - j|, n - |i - j|).
  $
  Every element of $chevron.l P, R chevron.r$ preserves circular distances, so
  it preserves $cal(O)_2(G)$. Hence $chevron.l P, R chevron.r <= G^((2))$.

  Conversely, suppose $sigma$ preserves $cal(O)_2(G)$. Then $sigma$ preserves
  the distance-one pairs, which are exactly the edges of the cycle graph $C_n$.
  Thus $sigma$ is an automorphism of $C_n$. Since $"Aut"(C_n) = D_(2 n) =
  chevron.l P, R chevron.r$, we get $G^((2)) <= chevron.l P, R chevron.r$. The
  two inclusions prove equality.
]

Together, @thm:symmetric-second-order-ceiling and @thm:cyclic-two-closure say
something quite concrete about AGOPs for cyclic symmetries. Even if the AGOP
separates all pair orbits perfectly, its automorphism group is dihedral, not
purely cyclic. The orientation distinguishing clockwise from counterclockwise
has been erased by the symmetric second-order statistic.

This is the clean mathematical reason modular addition is such a revealing test
case. The cyclic action
$
  t dot (a,b) = (a + t, b - t)
$
preserves $a + b mod p$, but the transposition $(a,b) |-> (b,a)$ also preserves
the same label. Thus cyclic pair structure naturally closes up to dihedral
structure when viewed through a symmetric AGOP.

== Vector-valued maps and Jacobian moments <sec:jacobian-moments>

The same commutant story holds for equivariant vector-valued maps when the
second-order object is built from Jacobians.

Let $rho_(X): G -> O(m)$ and $rho_(Y): G -> O(n)$ be orthogonal
representations. Let $f: RR^m -> RR^n$ be differentiable and $G$-equivariant:
$
  f(rho_(X)(g) x) = rho_(Y)(g) f(x)
  quad forall g in G, x in RR^m.
$
Assume the input law is invariant under $rho_(X)$, meaning that $X$ and
$rho_(X)(g) X$ have the same distribution for every $g in G$. Let
$J_f(x) in RR^(n times m)$ denote the Jacobian.

#lemma[Jacobian equivariance][
  For all $g in G$ and $x in RR^m$,
  $
    J_f(rho_(X)(g) x)
    =
    rho_(Y)(g) J_f(x) rho_(X)(g)^T.
  $
]<lem:jacobian-equivariance>

#proof[
  Differentiate
  $
    f(rho_(X)(g) x) = rho_(Y)(g) f(x)
  $
  with respect to $x$. Since $rho_(X)(g)$ is linear,
  $
    J_f(rho_(X)(g) x) rho_(X)(g) = rho_(Y)(g) J_f(x).
  $
  Multiplying on the right by $rho_(X)(g)^T$ gives the claim.
]

#definition[Jacobian second-moment operators][
  Define the input-side and output-side Jacobian second moments by
  $
    C_("in") := EE[J_f(X)^T J_f(X)] in RR^(m times m),
    quad
    C_("out") := EE[J_f(X) J_f(X)^T] in RR^(n times n).
  $
]<def:jacobian-second-moments>

#theorem[Commutant constraints for Jacobian moments][
  Under the equivariance and distributional invariance assumptions above,
  $
    rho_(X)(g) C_("in") rho_(X)(g)^T = C_("in"),
    quad
    rho_(Y)(g) C_("out") rho_(Y)(g)^T = C_("out")
    quad forall g in G.
  $
]<thm:jacobian-commutant-constraints>

#proof[
  By @lem:jacobian-equivariance,
  $
    J_f(rho_(X)(g) X)^T J_f(rho_(X)(g) X)
    =
    rho_(X)(g) J_f(X)^T J_f(X) rho_(X)(g)^T.
  $
  Taking expectations and using that $X$ and $rho_(X)(g) X$ have the same
  distribution gives
  $
    rho_(X)(g) C_("in") rho_(X)(g)^T = C_("in").
  $
  Similarly,
  $
    J_f(rho_(X)(g) X) J_f(rho_(X)(g) X)^T
    =
    rho_(Y)(g) J_f(X) J_f(X)^T rho_(Y)(g)^T,
  $
  and taking expectations gives the output-side identity.
]

For permutation representations on the input side, $C_("in")$ is again a
symmetric commutant element. Its automorphism group is therefore governed by
the same unordered-pair orbit structure and the same $2$-closure ceiling.

== Finite-sample concentration <sec:finite-sample-concentration>

The population statements above explain what the ideal second-order moments can
encode. Empirically, one estimates those moments from samples.

Let $X_1, dots, X_N$ be i.i.d. copies of $X$, and define
$
  hat(C)_("in")
  :=
  frac(1, N) sum_(i=1)^N J_f(X_i)^T J_f(X_i),
  quad
  hat(C)_("out")
  :=
  frac(1, N) sum_(i=1)^N J_f(X_i) J_f(X_i)^T.
$

#theorem[Matrix Bernstein bound for Jacobian moments][
  Assume $norm(J_f(X))_("op") <= L$ almost surely. Then, for any
  $delta in (0,1)$, with probability at least $1 - delta$,
  $
    norm(hat(C)_("in") - C_("in"))_("op")
    <=
    L^2 sqrt(frac(2 log(2 m / delta), N))
    + frac(L^2 log(2 m / delta), 3 N),
  $
  and
  $
    norm(hat(C)_("out") - C_("out"))_("op")
    <=
    L^2 sqrt(frac(2 log(2 n / delta), N))
    + frac(L^2 log(2 n / delta), 3 N).
  $
]<thm:matrix-bernstein-jacobian-moments>

#proof[
  For the input-side bound, let
  $
    Z_i := J_f(X_i)^T J_f(X_i),
    quad
    mu := EE[Z_i] = C_("in").
  $
  The assumption $norm(J_f(X))_("op") <= L$ gives
  $
    0 <= Z_i <= L^2 I_m
    quad "and" quad
    0 <= mu <= L^2 I_m.
  $
  Hence $Y_i := Z_i - mu$ satisfies $EE[Y_i] = 0$ and
  $norm(Y_i)_("op") <= L^2$. Also $Y_i^2 <= L^4 I_m$, so the matrix Bernstein
  variance proxy obeys
  $
    v := norm(sum_(i=1)^N EE[Y_i^2])_("op") <= N L^4.
  $
  Applying the self-adjoint matrix Bernstein inequality to $sum_(i=1)^N Y_i$
  and dividing by $N$ gives the displayed input-side estimate. The proof for
  $hat(C)_("out")$ is identical with $Z_i = J_f(X_i) J_f(X_i)^T$ and ambient
  dimension $n$.
]

== Support recovery from diagonal gaps <sec:support-recovery>

For scalar $f: RR^d -> RR$, the diagonal of the EGOP has the direct sensitivity
interpretation
$
  C_(i i) = EE[(partial_i f(X))^2].
$
If a subset of coordinates has a uniform diagonal gap over the rest, the AGOP
recovers that subset by a simple top-$k$ rule.

#theorem[Exact support recovery from a diagonal gap][
  Fix $k in {1, dots, d}$. Suppose there exists a subset $S subset [d]$ with
  $|S| = k$ and constants $a > b >= 0$ such that
  $
    C_(i i) >= a " for " i in S,
    quad
    C_(j j) <= b " for every " j " outside " S.
  $
  Let $gamma := a - b > 0$. If an estimator $hat(C)$ satisfies
  $
    max_(i in [d]) |hat(C)_(i i) - C_(i i)| < gamma / 2,
  $
  then the indices of the top-$k$ diagonal entries of $hat(C)$ coincide with
  $S$.
]<thm:diagonal-gap-support-recovery>

#proof[
  For $i in S$ and $j$ outside $S$,
  $
    hat(C)_(i i)
    > C_(i i) - gamma / 2
    >= a - gamma / 2
    = b + gamma / 2
    >= C_(j j) + gamma / 2
    > hat(C)_(j j).
  $
  Thus every diagonal entry indexed by $S$ is larger than every diagonal entry
  outside $S$, so the top-$k$ diagonal entries recover exactly $S$.
]

#lemma[Sufficient sample size under bounded partial derivatives][
  Assume $|partial_i f(X)| <= L$ almost surely for every $i in [d]$. Let
  $hat(C)$ be the AGOP computed from $n$ i.i.d. samples of $X$. Then, with
  probability at least $1 - delta$,
  $
    max_(i in [d]) |hat(C)_(i i) - C_(i i)|
    <=
    L^2 sqrt(frac(log(2 d / delta), 2 n)).
  $
  In particular, if
  $
    n >= frac(2 L^4, gamma^2) log(frac(2 d, delta)),
  $
  then @thm:diagonal-gap-support-recovery recovers $S$ with probability at
  least $1 - delta$.
]<lem:bounded-partial-sample-size>

#proof[
  Each diagonal entry $hat(C)_(i i)$ is the empirical mean of i.i.d. random
  variables $(partial_i f(X))^2 in [0, L^2]$. Hoeffding's inequality gives
  $
    PP(|hat(C)_(i i) - C_(i i)| >= t)
    <=
    2 exp(-2 n t^2 / L^4).
  $
  A union bound over $i in [d]$ gives
  $
    PP(max_(i in [d]) |hat(C)_(i i) - C_(i i)| >= t)
    <=
    2 d exp(-2 n t^2 / L^4).
  $
  Solving for $t$ yields the displayed high-probability bound. Requiring that
  bound to be at most $gamma / 2$ gives the sample-size condition.
]

== Beyond one symmetric AGOP <sec:beyond-one-symmetric-agop>

The ceiling above is not merely a single-matrix accident. A finite family of
symmetric second-order matrices, all carrying the same unordered-pair commutant
constraint, still cannot break the $2$-closure ambiguity. Intersecting
automorphism groups can remove accidental symmetries above $G^((2))$, but it
cannot recover orientation below $G^((2))$.

#theorem[Tuples of symmetric commutant matrices still identify at most
  $G^((2))$][
  Let $C^((1)), dots, C^((T)) in RR^(d times d)$ be symmetric matrices with
  $C^((t)) in "End"_G(RR^d)$ for every $t$. Define the automorphism group of
  the tuple by
  $
    "Aut"(C^((1)), dots, C^((T)))
    :=
    {sigma in S_d :
      P_sigma C^((t)) P_sigma^T = C^((t))
      " for every " t = 1, dots, T}.
  $
  Then
  $
    G^((2)) <= "Aut"(C^((1)), dots, C^((T))).
  $
  If the tuple is jointly orbit-separating, meaning that for any two distinct
  unordered-pair orbits in $cal(O)_2(G)$ there is some $t$ whose entries differ
  on those two orbits, then
  $
    "Aut"(C^((1)), dots, C^((T))) = G^((2)).
  $
]<thm:tuple-symmetric-second-order-ceiling>

#proof[
  By @lem:orbit-constancy, every $C^((t))$ is constant on unordered-pair
  $G$-orbits. If $sigma in G^((2))$, then $sigma$ preserves those orbits, so
  $
    C^((t))_(sigma(i) sigma(j)) = C^((t))_(i j)
  $
  for every $i,j$ and every $t$. Thus $sigma$ preserves every matrix in the
  tuple, proving
  $
    G^((2)) <= "Aut"(C^((1)), dots, C^((T))).
  $

  Conversely, assume joint orbit separation and take
  $sigma in "Aut"(C^((1)), dots, C^((T)))$. If ${sigma(i), sigma(j)}$ were in a
  different unordered-pair orbit from ${i,j}$, then some $C^((t))$ would assign
  different values to those two orbits, contradicting preservation of the $t$th
  matrix. Hence $sigma$ preserves $cal(O)_2(G)$, so $sigma in G^((2))$.
]

#lemma[A non-symmetric cross-moment retains orientation][
  Under the invariant setting in @def:invariant-setting, for any fixed $g in G$
  define
  $
    M_g := EE[nabla f(X) nabla f(P_g X)^T].
  $
  Then
  $
    M_g = C P_g^T,
  $
  which is generally non-symmetric when $g$ is not an involution.
]<lem:oriented-cross-moment>

#proof[
  By @lem:gradient-equivariance,
  $
    nabla f(P_g X) = P_g nabla f(X)
  $
  almost surely. Therefore
  $
    M_g
    = EE[nabla f(X) nabla f(X)^T P_g^T]
    = C P_g^T.
  $
]

#remark[What has to be added to break orientation][
  The non-symmetric moment above is not "more of the same" symmetric AGOP
  information. It uses an oriented relation between $X$ and $P_g X$. That extra
  orientation can make the matrix depend on ordered-pair data rather than only
  unordered-pair data. Without such oriented information, a family of symmetric
  second-order moments remains bounded by
  @thm:tuple-symmetric-second-order-ceiling.
]

== Takeaway <sec:takeaway>

The AGOP is a rich object, but in the scalar permutation-invariant setting it
is still one symmetric second-order matrix. That places it in the commutant of
the group action and makes its entries constant on unordered-pair orbits. If
those orbits are separated, the automorphism group of the AGOP is exactly the
unordered-pair $2$-closure $G^((2))$; if they are not separated, the
automorphism group is even larger.

For the regular cyclic action, this closure is dihedral:
$
  C_n^((2)) = D_(2 n).
$
So a cyclic-looking AGOP can produce a dihedral symmetry group without any
additional mechanism. That is the identifiability ceiling: one symmetric AGOP
can expose pair-orbit geometry, but it cannot by itself recover oriented group
structure beyond the $2$-closure.






// In fact, my original interest in the AGOP came from what I hope would be its
// ability to reveal the symmetries of a given function. In my work, I was
// studying under what circumstances I one could learn the permutation group
// equivariance of functions $f$ when expressed _reynolds average_ of some hidden
// function $h$ @JMLR:v25:22-0891.
//
// #definition[Reynolds Operator][
//   Let $h: X -> Y$ be some arbitrary function, and let $pi_(X): G times X -> X$,
//   and $pi_(Y): G times Y -> Y$ be actions of some group $G$ on $h$'s input and
//   output spaces $X$, and $Y$. The _reynolds average_ of $f$ with respect to the
//   triplet $(G, pi_(X), pi_(Y))$ is the function $f: X -> Y$
//   $
//     f(x) = op("Reynolds")(h)(x) := sum_(g in G)^() pi_(Y)^(-1)(g, h(pi_(X)(g, x))).
//   $
// ]<def:ReynoldsOperator>
//
// #remark[The Reynolds Operator is Always $G$-Equivariant
// ][
//   The key feature of the Reynolds operator is that it does not need arbitrary
//   $h$ to have any symmetry of its own. Assuming $G$ is finite and $pi_(Y)$ acts
//   linearly on $Y$, for any $g in G$ we can re-index the sum:
//   $
//     op("Reynolds")(h)(pi_(X)(g, x))
//     &= sum_(u in G)^() pi_(Y)^(-1)(u, h(pi_(X)(u g, x))) \
//     &= sum_(w in G)^() pi_(Y)^(-1)(w g^(-1), h(pi_(X)(w, x))) \
//     &= pi_(Y)(g, sum_(w in G)^() pi_(Y)^(-1)(w, h(pi_(X)(w, x)))) \
//     &= pi_(Y)(g, op("Reynolds")(h)(x)).
//   $
//   Thus $op("Reynolds")(h)$ is $G$-equivariant even when the hidden function $h$
//   is completely arbitrary. The averaging procedure maps $h$ into the subspace
//   of functions compatible with the chosen input and output group actions.
// ]<remark:TheReynoldsOperatorMakesAnyFunctionGEquivariant>
