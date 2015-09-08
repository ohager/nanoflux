# nanoflux

A very lightweight and dependency-free Flux implementation

The idea of this implementation is to support a very small full Flux implementation (separated Action, Dispatcher, and Store), but also a "fluxy" version, with Action and Dispatcher merged in one unit. Furthermore, the *nanoflux* does not use events for communication, but a functional approach for (hopefully) more performant solution (Tests will be made).

For examples take a look in the wiki.

## work in progress

# TO DO

- Implement dispatcher.dispatch('actionName')
- Unit tests
- Gulp build chain (minification, etc.)
- More examples

