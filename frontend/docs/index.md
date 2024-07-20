# Documentation

## Nouns, and Their Relationships Expressed Through Verbs

I believe a `page` is a entity identified by its `url`. It's life-cycle starts
with a created_at time stamp, and continues as its modified.

There is also the entity of a `visitor`. A visitor is identified by their
public `ip` address. A `visitor` _visits_ a `page` and _comments_ on a `page`.

Another way of expressing this is that a `page` is _visited by_ a `visitor`, and
is _commented by_ a `visitor`.

In either case, the italicized words are transitive verbs. Transitive verbs
represent a relationship between two nouns, where one noun is the subject, and
the other is the object. Of the two relationships I described, both are between
a `page` and a `visitor`. The question is, should the `visitor` be the subject
or should the `page` be the subject?

By assigning the subject and object appropriately, we implicitly determine
which noun _owns_ the relationship.

Although `visitors` are essentially anonymous while a `page` is a thing that I
own, for now I think it makes the most sense to model the `visitor` as the
subject in both relationships with `page`, hence the owner of the relationship.

## Modeling The Visitor Entity and The Comment Relationsihp With Page

As I said above, I think it makes sense for the visitor to own the relationship.
Perhaps, then, the best thing to do is create a method on the visitor entity called
`visitor:comment(page_url, comment)`. But think for a moment, does that really make sense?
How do we validate if the page_url exists? What the heck does this method meaningfully do?

Really, it should be the `service` that manages the comments. At this point,
I am lost and think I just need to build out the comment and see where to go from there.
